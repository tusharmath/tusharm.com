```metadata
title: Writing a maintainable webpack config
author: tushar-mathur
date: 2018-08-02
template: article.jade
```

Over a period of time webpack configs usually become really large and hard to maintain. In one of my cases `webpack.config.js` had become more than **1000** lines!
In this blog I am going to talk about how to write **composable** webpack configs that are easy to read and maintainable.

I will be using a lot of [ramda] and if you are unfamiliar with its syntax I would recommend you to go thru this [post](http://randycoulman.com/blog/2016/05/24/thinking-in-ramda-getting-started/) by [Randy Coulman] on getting started with ramda.

[ramda]: http://ramdajs.com/docs/
[randy coulman]: http://randycoulman.com/blog/2016/05/24/thinking-in-ramda-getting-started/

---

# Typical configs

1.  Uses a custom loader for non `.js` files.
2.  Creates optimized builds in **production** mode, based on the **NODE_ENV**.
3.  Adds version control to the assets generated, by attaching a `chunkhash` to its name.

It would look something like this—

```
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

The above config has a few issues —

1.  It is one big monolithic object.
2.  Exposes unnecessary inner details about about how one can configure "webpack".
3.  The conditional logic is tightly coupled with the structure of the config.

Lets look at the optimizations that we can make to make this config more maintainable.

# Extracting NODE_ENV check

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

# Configuration Setters

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

The above composition looks complicated around the `export =` statement. Next step will be to make these setters work in harmony with each other.

# Composing setters

Since the setter functions take in a `WebpackConfig` and return a new `WebpackConfig` without causing any side effects, we can compose them by calling them one after the other in any order! We are going to write a generic function `composeSetters` through which we will be able easily use multiple setters together.

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

`composeSetters` basically takes in an initial config and an array of setter functions and applies them one after the other on the initial state. Ultimately returns a new webpack config.

# Array based setters

[R.assocPath] works well when you want to set properties inside a deeply nested object. To append a value into an array we are going to use a mix of [R.over] and [R.append].

[r.over]: https://ramdajs.com/docs/#over
[r.append]: https://ramdajs.com/docs/#append

Thus with [ramda] we can make a setter for `module.rules` as well.

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

Turns out we don't need to change `composeSetters` to make it work with the new `setRule` setter.

# Conditional Setters

The `output.filename` and the `mode` properties are conditionally set based on if `isProduction()` returns `true` or `false`.
This can be done by having a default property set in the base config and then conditionally applying a setter on that base config.

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

`R.identity` works as a setter that returns the provided `webpack.config` as is, ie. without changing it.
That way we don't need to change the implementation of `composeSetters` as it always gets a valid setter function.

# Higher Order Setters

Higher order setters are setters that take in a setter as an input and returns a new setter as an output. In our case we will create a new higher order setter called `whenever` which will helps us in applying a particular setter only if the given condition it `true`.

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

The `whenever` function takes in two arguments — `condition` and a `setter` and returns another setter function that when called with a `webpack.config` calls the passed `setter` if `condition` is true, otherwise returns the same config without changing.

# Final Config

Finally out overall code looks somewhat like this —

```
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
  mode: 'development'
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
