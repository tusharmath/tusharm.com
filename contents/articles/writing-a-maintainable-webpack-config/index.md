```metadata
title: Writing a maintainable webpack config
author: tushar-mathur
date: 2018-08-02
template: article.jade
```

Over a period of time webpack configs usually become really large and hard to maintain. In one of my cases `webpack.config.js` had become more than **1000** lines!
In this blog I am going to talk about how to write **composable** webpack configs that are easy to read and maintainable.

I will be using a lot of [ramda] and if you are unfamiliar with its syntax I would recommend you to go thru this [post](http://randycoulman.com/blog/2016/05/24/thinking-in-ramda-getting-started/) by [Randy Coulman] on getting started with it.

[ramda]: http://ramdajs.com/docs/
[randy coulman]: http://randycoulman.com/blog/2016/05/24/thinking-in-ramda-getting-started/

---

# Typical configs

1.  Has an `entry` and `output` setting.
2.  Uses a custom loader for non `.js` files.
3.  Creates optimized builds in **production** mode, based on **NODE_ENV**.
4.  Adds version control to the assets generated, by attaching a `chunkhash` to its name.

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

Lets look at some of the optimizations that we can do to make this config more maintainable.

# Extracting NODE_ENV check

In the above config the check for `NODE_ENV` is being done twice and can be moved out to a function `isProduction` using [R.pathEq].

[r.patheq]: https://ramdajs.com/docs/#pathEq

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
+   mode: isProduction(process) ? 'production': 'development'
  }
  export = baseConfig
```

# Configuration Setters

A setter function is a function that takes in a `WebpackConfig` and returns a new `WebpackConfig`, with some new properties attached to it.

For eg. we can have a function `setEntry` that sets `entry` property in the config. We are going to use [R.assoc] to set config properties for this purpose.

[r.assoc]: https://ramdajs.com/docs/#assoc

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
  mode: isProduction(process) ? 'production': 'development'
 }

- export = baseConfig
+ export = setEntry('./src/main.ts', baseConfig)
```

Similarly we can write setters for `output` using `R.assocPath`.

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
  mode: isProduction(process) ? 'production': 'development'
 }

- export = setEntry('./src/main.ts', baseConfig)
+ export = setOutputPath(
+    path.resolve(__dirname, 'dist'),
+    setEntry('./src/main.ts', baseConfig)
+ )
```

The above composition between `setEntry` and `setOutputPath` looks overly complicated around the `export =` statement lets see if we can optimize it further.

# Composing setters

Since the setter functions take in a `WebpackConfig` and return a new `WebpackConfig` without causing any side effects, we can use [R.compose] to compose multiple setter functions into one.

[r.compose]: https://ramdajs.com/docs/#compose

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
  mode: isProduction(process) ? 'production': 'development'
}

+ const setAppConfig = R.compose(
+   setOutputPath(path.resolve(__dirname, 'dist')),
+   setEntry('./src/main.ts')
+ )

- export = setOutputPath(
-    path.resolve(__dirname, 'dist'),
-    setEntry('./src/main.ts', baseConfig)
- )
+ export = setAppConfig(baseConfig)
```

`setAppConfig` is setter that is composed of two setters viz. `setOutputPath` and `setEntry`. We will see that this composition turns out to be really powerful in structuring more complicated configs.

# Array based setters

[R.assocPath] works well when you want to set properties inside a deeply nested object. Similarly to append a value into an array we are going to use it with a mix of other powerful ramda to make an elegant setter for `module.rules` as follows —

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
  mode: isProduction(process) ? 'production': 'development'
 }


 const setAppConfig = R.compose(
   setOutputPath(path.resolve(__dirname, 'dist')),
   setEntry('./src/main.ts'),
+  setRule({test: /\.tsx?$/, use: [{ loader: 'ts-loader' }]})
 )

 export = setAppConfig(baseConfig)
```

Its alright if you don't understand the internals of `setRule` function. What's more important is to know what it does, which is — Its a function that takes two arguments a value and a config and appends the value at the path `module.rules[]` inside the config and returns a new config object.

# Conditional Setters

The `output.filename` and the `mode` properties are conditionally set based on if `isProduction` returns `true` or `false`.
This can be improved by having a default property set in the base config and then conditionally applying a setter on that base config.

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
-   mode: isProduction(process) ? 'production': 'development'
+   mode: 'development'
 }

 const setAppConfig = R.compose(
   setOutputPath(path.resolve(__dirname, 'dist')),
   setEntry('./src/main.ts'),
   setRule({test: /\.tsx?$/, use: [{ loader: 'ts-loader' }]}),
+  isProduction(process) ? setOutputFilename('[name]-[chunkhash].js'): R.identity,
+  isProduction(process) ? setMode('production'): R.identity
 )

 export = setAppConfig(baseConfig)
```

`R.identity` works as a setter that returns the provided `webpack.config` as is, ie. without changing it.

# Higher Order Setters

Higher order setters are setters that take in a setter as an input and returns a new setter as an output. In our case we will create a new higher order setter called `whenever` which will help us in applying a particular setter only if the given condition is `true`.

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

 const setAppConfig = R.compose(
   setOutputPath(path.resolve(__dirname, 'dist')),
   setEntry('./src/main.ts'),
   setRule({test: /\.tsx?$/, use: [{ loader: 'ts-loader' }]}),
-  isProduction(process) ? setOutputFilename('[name]-[chunkhash].js'): R.identity,
-  isProduction(process) ? setMode('production'): R.identity
+  inProduction(setOutputFilename('[name]-[chunkhash].js')),
+  inProduction(setMode('production'))
 )

 export = setAppConfig(baseConfig)
```

The `whenever` function takes in two arguments — condition and a setter and returns another setter function that when called with a config calls the passed setter if the condition is true, otherwise returns the passed config as is.

# Grouping Setters

Using [R.compose] we can now group the setters into two setters — `setDefaultConfig` and `setProductionConfig`.

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
  const whenever = R.ifElse(
    R.nthArg(0),
    R.converge(R.call, [R.nthArg(1), R.nthArg(2)]),
    R.nthArg(2)
  )
  const inProduction = whenever(isProduction(process))

+ const setDefaultConfig = R.compose(
+   setOutputPath(path.resolve(__dirname, 'dist')),
+   setEntry('./src/main.ts'),
+   setRule({test: /\.tsx?$/, use: [{ loader: 'ts-loader' }]}),
+ )

+ const setProductionConfig = R.compose(
+   setOutputFilename('[name]-[chunkhash].js'),
+   setMode('production')
+ )

  const baseConfig = {
    output: {
      filename: '[name].js'
    },
    module: {rules: []},
    mode: 'development
  }

 const setAppConfig = R.compose(
-  setOutputPath(path.resolve(__dirname, 'dist')),
-  setEntry('./src/main.ts'),
-  setRule({test: /\.tsx?$/, use: [{ loader: 'ts-loader' }]}),
+  setDefaultConfig,
-  inProduction(setOutputFilename('[name]-[chunkhash].js'))
-  inProduction(setMode('production'))
+  inProduction(setProductionConfig)
 )

 export = setAppConfig(baseConfig)
```

# Final Config

Finally our overall code looks somewhat like this —

```ts
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

const setDefaultConfig = R.compose(
  setOutputPath(path.resolve(__dirname, 'dist')),
  setEntry('./src/main.ts'),
  setRule({ test: /\.tsx?$/, use: [{ loader: 'ts-loader' }] })
)

const setProductionConfig = R.compose(
  setOutputFilename('[name]-[chunkhash].js'),
  setMode('production')
)

const baseConfig = {
  output: {
    filename: '[name].js'
  },
  module: { rules: [] },
  mode: 'development'
}

const setAppConfig = R.compose(
  setDefaultConfig,
  inProduction(setProductionConfig)
)

export = setAppConfig(baseConfig)
```
