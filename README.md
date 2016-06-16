# nanlayout

Experimental layout with node.js bindings. It supports graph layouts in 1D, 2D,
3D, and 4D spaces. It also can be compiled with OpenMP support, which boosts
performance even further, by leveraging multi-threading techniques.

# WARNING

This is not supposed to be used yet. Sometimes it may crash/hang.

# Install

Currently only OSX/Linux platforms are supported.

``` shell
git clone https://github.com/anvaka/nanlayout
cd nanlayout
npm install
```

This will download all dependencies and will attempt to compile the module.
If you run into any compilation errors, you can always recompile it with:

``` shell
npm run configure
npm run build
```

## compiling with openmp

By default the build you get from `npm run build` is single-threaded. If you want
to create multi-threaded build, keep reading.

### OSX

You will need to install OpenMP enabled clang compiler. I used [clang-omp](https://clang-omp.github.io/)
during development:

```
brew install clang-omp
```

Before compiling this library with this compiler, make sure it's exported:

```
export CXX=`which clang-omp++`
```

It is also expected that `libiomp5` library is located at `/usr/local/lib/libiomp5.dylib`

Once all prerequisites are met, run:

```
npm run configure-omp
npm run build
```

This should generate OpenMP build.

### Linux

I used gcc compiler version 4.8.4. This produced OpenMP build:

```
npm run configure-omp
npm run build
```

If you run into any issues - let me know.

# API

It's unstable and will likely change. See `test` directory for the reference.
