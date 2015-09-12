#!/usr/bin/env node


var program = require('commander')
var package = require('../package.json')
var prompt = require('prompt')
var fs = require('fs')
var _ = require('underscore')

var templateStr = _.template(fs.readFileSync(`${__dirname}/content.tmpl.md`).toString())
program
  .version(package.version)
  .command('create')
  .action (function (type) {
      prompt.start()
      prompt.get(['title', 'type', 'author', 'time'], function (err, result){

        var dir = `${__dirname}/../contents/articles/${result.title.replace(/ /g, '-')}`
        fs.mkdirSync(dir)
        fs.writeFileSync( `${dir}/index.md`, templateStr(result))
      })
  })

program.parse(process.argv)
