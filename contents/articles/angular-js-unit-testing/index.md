```metadata
title: AngularJS unit testing
author: tushar-mathur
date: 2014-May-09
category: article
template: article.jade
```
I have literally spent hours figuring out how to setup my angularjs application for unit testing. After reading multiple blogs and posting questions on stackoverflow, I am writing this blog about the things that need to be kept in mind while developing an enterprise level software.

<span class="more"/>

#Initial Setup

1. [KarmaJS](http://karma-runner.github.io) - A program that loads the script files into a real browser and runs tests.
2. [ngMock](https://docs.angularjs.org/api/ngMock) - A special purpose module built to inject mocked Angular Services into your tests.
3. [SinonJS](http://sinonjs.org) - This is the ultimate tool for mocking JS objs and methods.
4. [Mocha](http://visionmedia.github.io/mocha) — The testing framework.


#Step 1: Injecting the providers

We have primarily two types of providers - Singletons, and non singletons. Controllers and Directives are non singletons. In an application a controller can be initialized as many times as you want using the `ng-controller` directive. The same applies to custom directives, when ever a custom directive is found in a page it initialized via the `link` method.

Services on the other hand are initialized only once.