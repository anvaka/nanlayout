#include "NanLayout.h"

NanLayout::NanLayout(NanGraph* nanGraph, int dimension): _nangraph(nanGraph), _dimension(dimension) {
  // TODO: Is there a chance that nanGraph is disposed during GC?
  // TODO: Ideally we'd like to support higher dimensions at runtime... 
  if (dimension == 2) {
    _layout = new ForceLayout<2>(*_nangraph->getGraph());
  } else {
    // TOOD: This should probably throw if dimension is not 2 or 3.
    _layout = new ForceLayout<3>(*_nangraph->getGraph());
  }
};

NanLayout::~NanLayout() {
  delete _layout;
};

Nan::Persistent<v8::Function> NanLayout::constructor;

NAN_MODULE_INIT(NanLayout::Init) {
  v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);

  tpl->SetClassName(Nan::New("NanLayout").ToLocalChecked());
  // need to set internal fields in order to be able to wrap object.
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  Nan::SetPrototypeMethod(tpl, "step", Step);
  Nan::SetPrototypeMethod(tpl, "getNodePosition", GetNodePosition);
  Nan::SetPrototypeMethod(tpl, "getGraphRect", GetGraphRect);

  constructor.Reset(Nan::GetFunction(tpl).ToLocalChecked());
  Nan::Set(target, Nan::New("Layout").ToLocalChecked(), Nan::GetFunction(tpl).ToLocalChecked());
}

NAN_METHOD(NanLayout::New) {
  if (info.IsConstructCall()) {
    if (info.Length() < 1) {
      Nan::ThrowError("Graph structure cannot be undefined");
      return;
    }
    
    NanGraph *graphWrapper;
    auto jsGraph = info[0]->ToObject();
    if (jsGraph.IsEmpty() || jsGraph->InternalFieldCount() == 0) {
      Nan::ThrowError("Could not unwrap graph. Are you using NanGraph?");
      return;
    }

    int dimension = info[1]->IsUndefined() ? 3 : Nan::To<double>(info[1]).FromJust();
    bool dimensionIsValid = dimension == 2 || dimension == 3;
    if (!dimensionIsValid) {
      Nan::ThrowError("Only 2d and 3d dimensions are supported at the moment");
      return;
    }

    // TODO: How should I check whether wrapped object is NanGraph? node
    // extensions are compiled with rtti disabled
    graphWrapper = ObjectWrap::Unwrap<NanGraph>(jsGraph);
    NanLayout *obj = new NanLayout(graphWrapper, dimension);

    obj->Wrap(info.This());
    info.GetReturnValue().Set(info.This());
  } else {
    const unsigned argc = 0;

    v8::Local<v8::Value> argv[argc] = {};
    v8::Local<v8::Function> cons = Nan::New<v8::Function>(NanLayout::constructor);
    v8::Local<v8::Object> instance = cons->NewInstance(argc, argv);

    info.GetReturnValue().Set(instance);
  }
}

NAN_METHOD(NanLayout::GetGraphRect) {
  NanLayout* self = ObjectWrap::Unwrap<NanLayout>(info.This());
  auto rect = Nan::New<v8::Object>();
  auto min = Nan::New<v8::Object>();
  auto max = Nan::New<v8::Object>();
  auto dimension = (uint32_t)self->_dimension;

  Nan::Set(min, Nan::New("length").ToLocalChecked(), Nan::New(dimension));
  Nan::Set(max, Nan::New("length").ToLocalChecked(), Nan::New(dimension));

  auto layout = self->_layout;
  auto root = layout->getTree()->getRoot();
  auto minBounds = root->getMin();
  auto maxBounds = root->getMax();
  for (uint32_t i = 0; i < dimension; ++i) {
    auto minValue = (*minBounds)[i];
    Nan::Set(min, i, Nan::New(minValue));
    auto maxValue = (*maxBounds)[i];
    Nan::Set(max, i, Nan::New(maxValue));
  }
  Nan::Set(rect, Nan::New("min").ToLocalChecked(), min);
  Nan::Set(rect, Nan::New("max").ToLocalChecked(), max);

  info.GetReturnValue().Set(rect);
}

NAN_METHOD(NanLayout::Step) {
  NanLayout* self = ObjectWrap::Unwrap<NanLayout>(info.This());

  int repeatCount = 1;
  if (info.Length() > 0) {
    repeatCount = Nan::To<double>(info[0]).FromJust();
    if (repeatCount < 1) repeatCount = 1;
  }

  double move = 0;
  auto layout = self->_layout;

  while (repeatCount > 0) {
    move += layout->step();
    repeatCount -= 1;
  }
  info.GetReturnValue().Set(move);
}

NAN_METHOD(NanLayout::GetNodePosition) {
  if (info.Length() == 0) {
    Nan::ThrowError("Node id is required to be a number");
    return;
  }

  NanLayout* self = ObjectWrap::Unwrap<NanLayout>(info.This());
  auto nodeIdPtr = self->_nangraph->getNodeId(info[0]);
  if (nodeIdPtr == nullptr) {
    std::string error = "Cannot find node with this id " + v8toString(info[0]);
    Nan::ThrowError(error.c_str());
    return;
  }

  auto pos = Nan::New<v8::Object>();
  auto dimension = (uint32_t)self->_dimension;
  Nan::Set(pos, Nan::New("length").ToLocalChecked(), Nan::New(dimension));

  auto bodyPosition = self->_layout->getBodyPosition(*nodeIdPtr);
  for (uint32_t i = 0; i < dimension; ++i) {
    auto value = (*bodyPosition)[i];
    Nan::Set(pos, i, Nan::New(value));
  }

  info.GetReturnValue().Set(pos);
}
