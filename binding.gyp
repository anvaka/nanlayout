{
  "targets": [
    {
      "target_name": "nanlayout",
      "sources": [
        "src/index.cc",
        "src/NanLayout.cc",
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ],
      "dependencies": [
        "<!(node -e \"console.log(require.resolve('nangraph/binding.gyp') + ':nangraph')\")",
        "<!(node -e \"console.log(require.resolve('nangraph.cc/gyp/nangraph.cc.gyp') + ':nangraph')\")",
        "<!(node -e \"console.log(require.resolve('forcelayout.cc/gyp/forcelayout.cc.gyp') + ':*')\")",
      ],
      "cflags+" : [ "-std=c++11" ],
      "cflags_cc+": [ "-std=c++11" ],
      "cflags!": [ '-fno-exceptions' ],
      "cflags_cc!": [ '-fno-exceptions' ],
      "conditions": [
          [ 'OS=="mac"', {
            "xcode_settings": {
              "OTHER_CPLUSPLUSFLAGS" : [
                  "-std=c++11",
                  "-stdlib=libc++",
              ],
              "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
              "OTHER_LDFLAGS": [ "-stdlib=libc++" ],
              "MACOSX_DEPLOYMENT_TARGET": "10.7"
            },
          }],
        ],
    }
  ]
}
