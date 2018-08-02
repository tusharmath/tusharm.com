```metadata
title: Writing a maintainable webpack config
author: tushar-mathur
date: 2018-08-02
template: article.jade
```

Over a period of time webpack configs usually become really large and hard to maintain. In one of my cases `webpack.config.js` had become more than **1000** lines! Here is how you can use [ramda] to manage a complicated webpack configuration setup.

[ramda]: http://ramdajs.com/docs/

Consider a typical `webpack.config` file where —

1.  We use a custom loader for `.ts` files.
2.  Create optimized builds in **production** mode, based on the **env**.
3.  Adds version control to the assets generated, by attaching a `chunkhash` to its name.

```ts
const baseConfig = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename:
      process.env.NODE_ENV === 'production'
        ? '[name]-[chunkhash].js'
        : '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: 'ts-loader' }]
      }
    ]
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
}

export = baseConfig
```

<!-- Issues in the current config -->

# Extract NODE_ENV check

In the above config the check for `NODE_ENV` is being done twice and can be moved out to a function using [ramda].

```patch
+ import * as R from 'ramda'
+ const isProduction = R.pathEq(['env', 'NODE_ENV'], 'production')

  const baseConfig = {
    entry: './src/main.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename:
-       process.env.NODE_ENV === 'production'
+       isProduction(process)
          ? '[name]-[chunkhash].js'
          : '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [{ loader: 'ts-loader' }]
        }
      ]
    },
-   mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
+   mode: isProduction(process) ? 'production': 'development
  }
  export = baseConfig
```

# Config setters

A setter function is a function that takes in a `WebpackConfig` object and returns a new `WebpackConfig` object with some new properties attached to it. For eg. we can have a function `setEntry` that sets `entry` property in the webpack config.

```patch
  import * as R from 'ramda'

  const isProduction = R.pathEq(['env', 'NODE_ENV'], 'production')
+ const setEntry = R.assoc('entry')

  const baseConfig = {
-   entry: './src/main.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename:
        isProduction(process)
          ? '[name]-[chunkhash].js'
          : '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [{ loader: 'ts-loader' }]
        }
      ]
    },
  mode: isProduction(process) ? 'production': 'development
 }

- export = baseConfig
+ export = setEntry('./src/main.ts', baseConfig)
```

[R.assoc] Makes a shallow clone of an object, setting or overriding the specified property with the given value. Similarly we can write setters for `output` using [R.assocPath].

[r.assoc]: https://ramdajs.com/docs/#assoc
[r.assocpath]: https://ramdajs.com/docs/#assocPath

```patch
  import * as R from 'ramda'

  const isProduction = R.pathEq(['env', 'NODE_ENV'], 'production')
  const setEntry = R.assoc('entry')
+ const setOutputPath = R.assocPath(['output', 'path'])

  const baseConfig = {
    output: {
-     path: path.resolve(__dirname, 'dist'),
      filename: isProduction(process)
          ? '[name]-[chunkhash].js'
          : '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [{ loader: 'ts-loader' }]
        }
      ]
    },
  mode: isProduction(process) ? 'production': 'development
 }

- export = setEntry('./src/main.ts', baseConfig)
+ export = setOutputPath(
+    path.resolve(__dirname, 'dist'),
+    setEntry('./src/main.ts', baseConfig)
+ )
```

The above composition looks complicated around the `export =` statement. Lets see if we can make that better.

# Composing setters

Since the setter functions take in a `WebpackConfig` and return a new `WebpackConfig` without causing any side effects we can compose them by calling them one after the other in any order!

```patch
 import * as R from 'ramda'

 const isProduction = R.pathEq(['env', 'NODE_ENV'], 'production')
 const setEntry = R.assoc('entry')
 const setOutputPath = R.assocPath(['output', 'path'])

const baseConfig = {
  output: {
    filename: isProduction(process)
        ? '[name]-[chunkhash].js'
        : '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: 'ts-loader' }]
      }
    ]
  },
  mode: isProduction(process) ? 'production': 'development
}

+ const composeSetters = R.reduce(R.flip(R.call))

- export = setOutputPath(
-    path.resolve(__dirname, 'dist'),
-    setEntry('./src/main.ts', baseConfig)
- )
+ export = composeSetters(baseConfig, [
+    setOutputPath(path.resolve(__dirname, 'dist')),
+    setEntry('./src/main.ts')
+ ])
```

`composeSetters` basically takes in an initial config and an array of setter functions and applies them one after the other on the initial state.

# Array based setters

With [ramda] we can make setters for `module.rules` as well.

```patch
  import * as R from 'ramda'

  const isProduction = R.pathEq(['env', 'NODE_ENV'], 'production')
  const setEntry = R.assoc('entry')
  const setOutputPath = R.assocPath(['output', 'path'])
+ const setRule = R.useWith(R.over(R.lensPath(['module', 'rules'])), [
+   R.append,
+   R.identity
+ ])

  const baseConfig = {
    output: {
      filename: isProduction(process)
          ? '[name]-[chunkhash].js'
          : '[name].js'
    },
    module: {
      rules: [
-       {
-         test: /\.tsx?$/,
-         use: [{ loader: 'ts-loader' }]
-       }
      ]
    },
  mode: isProduction(process) ? 'production': 'development
 }

const composeSetters = R.reduce(R.flip(R.call))

export = composeSetters(baseConfig, [
   setOutputPath(path.resolve(__dirname, 'dist')),
   setEntry('./src/main.ts'),
+  setRule({test: /\.tsx?$/, use: [{ loader: 'ts-loader' }]})
])
```

`composeSetters` makes it easy to add new setters like `setRule`.

# Conditional Setters

The `output.filename` and the `mode` properties are conditionally set based on if `isProduction()` returns `true` or `false`. This can be done by conditionally applying the setter.

```patch
  import * as R from 'ramda'

  const isProduction = R.pathEq(['env', 'NODE_ENV'], 'production')
  const setEntry = R.assoc('entry')
  const setOutputPath = R.assocPath(['output', 'path'])
  const setRule = R.useWith(R.over(R.lensPath(['module', 'rules'])), [
    R.append,
    R.identity
  ])
+ const setOutputFilename = R.assocPath(['output', 'filename'])
+ const setMode = R.assoc('mode')

  const baseConfig = {
    output: {
-     filename: isProduction(process)
-         ? '[name]-[chunkhash].js'
-         : '[name].js'
+     filename: '[name].js'
    },
    module: {rules: []},
-   mode: isProduction(process) ? 'production': 'development
+   mode: 'development
 }

  const composeSetters = R.reduce(R.flip(R.call))

  export = composeSetters(baseConfig, [
   setOutputPath(path.resolve(__dirname, 'dist')),
   setEntry('./src/main.ts'),
   setRule({test: /\.tsx?$/, use: [{ loader: 'ts-loader' }]}),
+  isProduction(process) ? setOutputFilename('[name]-[chunkhash].js'): R.identity,
+  isProduction(process) ? setMode('production'): R.identity
  ])
```

`R.identity` works as a setter that returns the provided `webpack.config` as is, without changing it. That way its much easier to compose multiple setter conditionally.

---

The redundant `isProduction` check can be further optimized by creating a generic function that conditionally applies a setter.

```patch
  import * as R from 'ramda'

  const isProduction = R.pathEq(['env', 'NODE_ENV'], 'production')
  const setEntry = R.assoc('entry')
  const setOutputPath = R.assocPath(['output', 'path'])
  const setRule = R.useWith(R.over(R.lensPath(['module', 'rules'])), [
    R.append,
    R.identity
  ])
  const setOutputFilename = R.assocPath(['output', 'filename'])
  const setMode = R.assoc('mode')
+ const whenever = R.ifElse(
+   R.nthArg(0),
+   R.converge(R.call, [R.nthArg(1), R.nthArg(2)]),
+   R.nthArg(2)
+ )
+ const inProduction = whenever(isProduction(process))

  const baseConfig = {
    output: {
      filename: '[name].js'
    },
    module: {rules: []},
    mode: 'development
  }

  const composeSetters = R.reduce(R.flip(R.call))

  export = composeSetters(baseConfig, [
    setOutputPath(path.resolve(__dirname, 'dist')),
    setEntry('./src/main.ts'),
    setRule({test: /\.tsx?$/, use: [{ loader: 'ts-loader' }]}),
-   isProduction(process) ? setOutputFilename('[name]-[chunkhash].js'): R.identity,
-   isProduction(process) ? setMode('production'): R.identity
+   inProduction(setOutputFilename('[name]-[chunkhash].js'))
+   inProduction(setMode('production'))
  ])
```

The `whenever` function takes in two arguments — `condition` and a `setter` and returns a function that when called with a `webpack.config` calls the `setter` if `condition` is true otherwise returns the same config without changing.

# Final Config

```js
import * as R from 'ramda'

const isProduction = R.pathEq(['env', 'NODE_ENV'], 'production')
const setEntry = R.assoc('entry')
const setOutputPath = R.assocPath(['output', 'path'])
const setRule = R.useWith(R.over(R.lensPath(['module', 'rules'])), [
  R.append,
  R.identity
])
const setOutputFilename = R.assocPath(['output', 'filename'])
const setMode = R.assoc('mode')
const whenever = R.ifElse(
  R.nthArg(0),
  R.converge(R.call, [R.nthArg(1), R.nthArg(2)]),
  R.nthArg(2)
)
const inProduction = whenever(isProduction(process))

const baseConfig = {
  output: {
    filename: '[name].js'
  },
  module: {rules: []},
  mode: 'development
}

const composeSetters = R.reduce(R.flip(R.call))

export = composeSetters(baseConfig, [
  setOutputPath(path.resolve(__dirname, 'dist')),
  setEntry('./src/main.ts'),
  setRule({test: /\.tsx?$/, use: [{ loader: 'ts-loader' }]}),
  inProduction(setOutputFilename('[name]-[chunkhash].js')),
  inProduction(setMode('production'))
])
```
