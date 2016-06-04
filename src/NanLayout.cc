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

  constructor.Reset(Nan::GetFunction(tpl).ToLocalChecked());
  Nan::Set(target, Nan::New("Layout").ToLocalChecked(), Nan::GetFunction(tpl).ToLocalChecked());
}

NAN_METHOD(NanLayout::New) {
  if (info.IsConstructCall()) {
    auto jsGraph = info[0]->ToObject();
    NanGraph *graphWrapper = ObjectWrap::Unwrap<NanGraph>(jsGraph);
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

NAN_METHOD(NanLayout::Step) {
  NanLayout* self = ObjectWrap::Unwrap<NanLayout>(info.This());
  double move = self->_layout->step();
  info.GetReturnValue().Set(move);
}

NAN_METHOD(NanLayout::GetNodePosition) {
  NanLayout* self = ObjectWrap::Unwrap<NanLayout>(info.This());
  if (info.Length() == 0) {
    Nan::ThrowError("Node id is required to be a number");
    return;
  }
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
