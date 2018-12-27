```metadata
title: node.js concurrency evaluation

date: 2015-12-14
category: project
template: article.jade
```



I have been using node.js for a decent amount of time now and I had this hypothesis which I needed to validate —

>For a node.js server running on multi core system, if I flood the server with `n` concurrent requests, to compute something expensive, it would handle the traffic better if the computation can be chunked in such a way that the server can compute those `n` computations, concurrently.

This is [timeslicing](https://en.wikipedia.org/wiki/Computer_multitasking), which should be equivalent to creating threads (atleast in theory) in `Java`. In fact, that's what [node.js uses](https://strongloop.com/strongblog/node-js-is-faster-than-java/) for IO operations, so technically my server should have a much higher throughput via this approach.

There are different ways to implement timeslicing viz. `setTimeout`, `process.nextTick` and `setImmediate`. There are subtle differences between all the three functions but bottom line is this — passing a callback to any of these functions defers its execution by some cpu cycles. This helps in letting CPU breathe and perform other tasks in the mean time such as — rendering (on frontend) or making HTTP requests etc.

For starters I want to compare the performance of a fibonacci algorithm on a process. So consider the following two fibonacci implementations —

#### Synchronous

```javascript
var fibonacci = n => {
  if (n < 2) {
    return 1
  }
  return fibonacci(n - 1) + fibonacci(n - 2)
}
```

#### Asynchronous

```javascript
var fibonacciAsync = (n, cb, slicer) => {
  slicer(() => {
    if (n < 2) {
      return process.nextTick(() => cb(1))
    }
    var out = []
    const add = x => {
      out.push(x)
      if (out.length === 2) {
        cb(out[0] + out[1])
      }
    }
    fibonacciAsync(n - 1, add, slicer)
    fibonacciAsync(n - 2, add, slicer)
  })
}
```

The first one is the most natural way of implementing fibonacci series using recursion, the second one uses `slicer` as a param, which could be any of the time slicing functions discussed above.


*Though one can optimize the algorithm as a whole to have better performance by memoizing the results, I needed something that takes a toll on node.js's single threaded architecture and get some basic metrics out of it.*

#### Test Suite

```javascript
var suite = new Benchmark.Suite

// add tests
suite

  .add('SYNC', () => {
    fibonacci(size)
  })
  .add('ASYNC:process.nextTick', d => {
    fibonacciAsync(size, d.resolve.bind(d), process.nextTick)
  }, {defer: true})
  .add('ASYNC:setTimeout', d => {
    fibonacciAsync(size, d.resolve.bind(d), setTimeout)
  }, {defer: true})
  .add('ASYNC:setImmediate', d => {
    fibonacciAsync(size, d.resolve.bind(d), setImmediate)
  }, {defer: true})

  .on('cycle', event => console.log(String(event.target)))
  .on('complete', function () {console.log('Fastest is ' + this.filter('fastest').pluck('name'))})
  .run({ 'async': true })

```

#### Results
```bash
SYNC x 14,611,668 ops/sec ±1.01% (90 runs sampled)

ASYNC:process.nextTick x 770 ops/sec ±1.16% (42 runs sampled)

ASYNC:setTimeout x 116 ops/sec ±0.79% (80 runs sampled)

ASYNC:setImmediate x 739 ops/sec ±0.93% (78 runs sampled)

Fastest is SYNC
```

*NOTE: that setTimeout is the worst performer*

Yes that's a no brainer, SYNC has to be the fastest. But wait, its almost 19,000 times faster than the fastest async! That changes quite a lot of things!

On the front end, sometimes when you are computing something expensive, its often suggested to chunk the computation so that the browser can do other tasks such as rendering etc. This gives an impression of snappy fast UI. This is perceived performance and yes I understand that in totality the task will take a lot more time to complete with this approach.

On the server side, I got seduced into taking the same approach, so that it is able to handle the requests concurrently. Looking at the performance difference it seems like even if it does, the difference is unbelievably high and it would definitely take up a lot more memory, deferring computation everytime and eventually get exhausted of all the resources.

>The CPU is taking me for spin if I give him a chance to relax, how dare he!

Alright, things are beginning to get more clearer in my head now, but the real test of my hypothesis will be on a multi core architecture. So I hosted the same code on simple node http server and forked the process 4x.

#### Load Test using [nperf](npmjs.com/package/nperf)
With concurrency set to 50 and averaging response times and rate of response of 1000 requests, here are the results.

|       | avg     | rate    | memory  |
|-------|---------|---------|---------|
| async | 751.467 | 64.80   | 1GB     |
| sync  | 23.38   | 2028.40 | 240MB   |

In this case, sync is still close to 30x faster than async. The results are pretty much the same for different concurrency settings and gets worse for async, as the computation gets more expensive.

The lesson to be learnt here is — First that my hypothesis was absurd and second that application level time slicing using the node's event loop, will NOT give us the same or even near the same performance of any native node module async behaviour. Neither will it be as fast as any thread based systems like `java`. This doesn't mean that node.js or Javascript is slower than `java` or any other threaded systems.
