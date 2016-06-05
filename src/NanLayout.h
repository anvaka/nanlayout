#ifndef NAN_LAYOUT_H
#define NAN_LAYOUT_H

#include <nan.h>
#include <memory>
#include "forcelayout.cc/layout.h"
#include "NanGraph.h"
#include "nangraph.cc/graph.h"

/**
 * This class provides v8 bindings to native Graph
 */
class NanLayout : public Nan::ObjectWrap {
 public:
  static NAN_MODULE_INIT(Init);

 private:
  NanGraph* _nangraph;
  ForceLayout* _layout;
  
  NanLayout() = delete;
  NanLayout(NanGraph* nangraph);
  ~NanLayout();

  static Nan::Persistent<v8::Function> constructor;

  static NAN_METHOD(New);

  static NAN_METHOD(GetGraphRect);
  static NAN_METHOD(Step);
  static NAN_METHOD(GetNodePosition);
};

#endif
