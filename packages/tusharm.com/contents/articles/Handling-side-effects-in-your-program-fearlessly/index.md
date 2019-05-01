```metadata
title: Handling side-effects in your program fearlessly
date: 2019-May-01
template: article.pug
hide: true
category: article
```

# What is an effect?

In software, a program is categorized as "effectful" if it needs to interact with the external environment for it to complete its purpose. For example `console.log` in JS, actually paints pixels on the screen and is thus an effectful function. Similarly using `fetch` to make an http call in the browser is a side-effect because for it to run it needs access to network. Simpler code pieces such as `new Date()` which returns the current date/time is also effectful because it relies on the system's clock.

# Concurrency and Effects.

TODO???

# Effects in Functional Programming?

In functional programming you work with pure functions. A pure function is —

1. Total: They return an output for every input. They shouldn't be throwing exceptions or just exit without completing.
2. Deterministic: For the same input they return the same output.
3. Pure: Their only effect is computing the output. They don't depend on external environments.

---

```ts
// impure function
const putStrLn = msg => console.log(msg)
```

# How to compose effect?

# Type-safe effect?

# Error handling inside effects?

# Testing effects?

# Effects in an environment?

# Intro to FIO?
