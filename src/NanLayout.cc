#include "NanLayout.h"

NanLayout::NanLayout(NanGraph* nanGraph): _nangraph(nanGraph) {
  // TODO: Is there a chance that nanGraph is disposed during GC?
  _layout = new ForceLayout(*_nangraph->getGraph());
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

    // TODO: How should I check whether wrapped object is NanGraph? node
    // extensions are compiled with rtti disabled
    graphWrapper = ObjectWrap::Unwrap<NanGraph>(jsGraph);
    NanLayout *obj = new NanLayout(graphWrapper);

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
  auto tree = self->_layout->getTree();
  auto root = tree->getRoot();

  auto rect = Nan::New<v8::Object>();
  Nan::Set(rect, Nan::New("x1").ToLocalChecked(), Nan::New(root->left));
  Nan::Set(rect, Nan::New("y1").ToLocalChecked(), Nan::New(root->top));
  Nan::Set(rect, Nan::New("z1").ToLocalChecked(), Nan::New(root->back));
  
  Nan::Set(rect, Nan::New("x2").ToLocalChecked(), Nan::New(root->right));
  Nan::Set(rect, Nan::New("y2").ToLocalChecked(), Nan::New(root->bottom));
  Nan::Set(rect, Nan::New("z2").ToLocalChecked(), Nan::New(root->front));
  
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
  while (repeatCount > 0) {
    move += self->_layout->step();
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

  auto body = self->_layout->getBody(*nodeIdPtr);
  auto pos = Nan::New<v8::Object>();
  Nan::Set(pos, Nan::New("x").ToLocalChecked(), Nan::New(body->pos.x));
  Nan::Set(pos, Nan::New("y").ToLocalChecked(), Nan::New(body->pos.y));
  Nan::Set(pos, Nan::New("z").ToLocalChecked(), Nan::New(body->pos.z));
  info.GetReturnValue().Set(pos);
}
