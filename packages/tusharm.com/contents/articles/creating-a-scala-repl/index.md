```metadata
title: Creating a Scala REPL

date: 2018-08-21
template: article.pug
```

The best way to learn a new language is to create a simple file for that programming language and keep running it in watch mode. I personally use `watch` and [VSCode] when I want to quickly prototype something. `watch` helps me run that code continuously as I type and provides me with instant feedback on the terminal. I have found this technique really helpful in the past specially while learning something new.

[vscode]: https://code.visualstudio.com/

Here are the steps to setup a basic scala `REPL` on mac.

# Create a .scala File

Create a file named `main.scala` —

```scala
// main.scala

object Main extends App {
  println("Customary Hello World!")
}
```

# Install Watch

`watch` is a great OSX utility that keeps running a command every few seconds.

```
brew install watch
```

# Watch & Run

Setup the watch command to keep running your code in the background —

**Execute:**

```
watch scala main.scala
```

**Compile Only:**

```
watch scalac main.scala
```

# Using SBT

[SBT] provides a an alternative way to watch and run scala code.

```bash
sbt ~run
```

This way the `main.scala` is only executed when the file actually changes. The disadvantage of this approach is that you can not pass a random file path.

Also checkout **[repl.it]** if you don't want to setup all this stuff locally. Unfortunately at the time of writing this blog, scala wasn't supported.

[repl.it]: https://repl.it/
