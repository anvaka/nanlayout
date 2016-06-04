/**
 * Our entry point to the module
 */
#include "NanLayout.h"

using v8::FunctionTemplate;

NAN_MODULE_INIT(InitAll) {
  NanLayout::Init(target);
}

NODE_MODULE(nanlayout, InitAll)
