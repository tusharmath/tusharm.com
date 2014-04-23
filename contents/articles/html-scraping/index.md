```metadata
title: HTML Scraping
author: tushar-mathur
date: 2013-12-21
category: project
template: project.jade
```
This scraper has **three** components: `http` → `split` → `extract`, executed in the same order. You make an `http` request to fetch a page, `split` the page into different sections and ultimately `extract` the data from each section using a custom parser.

**For Example:**

```coffeescript

$ = new Scraper url: 'http://tusharm.com'


$.chain
.http('url')
.split('.intro')
.extract('titles', (doc)->
	anchor = doc.find '.intro h2 a'
	href: 'http://tusharm.com' + anchor.attr('href')
	title: anchor.text()
).http('href')
.split('body')
.extract('content', (doc)->
	data: doc.find('p').text()
	)


$.execute (result) -> console.log result
```