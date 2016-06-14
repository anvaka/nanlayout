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
  IForceLayout* _layout;
  int _dimension;
  
  NanLayout() = delete;
  NanLayout(NanGraph* nangraph, int dimension);
  ~NanLayout();

  static Nan::Persistent<v8::Function> constructor;

  static NAN_METHOD(New);

  static NAN_METHOD(GetGraphRect);
  static NAN_METHOD(Step);
  static NAN_METHOD(GetNodePosition);
  static NAN_METHOD(SetNodePosition);
};

#endif
