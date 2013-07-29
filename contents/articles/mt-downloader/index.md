---
title: Mt Downloader
author: tushar-mathur
date: 2013-06-30
category: career
template: project.jade
---
Mt-downloader is multi threaded downloader which is made in nodejs. It is highly configurable and extremely efficient.

Installation: ```$ npm install mt-downloader```

* Supports virtually unlimited number of download threads. This helps in proper utilization of the bandwidth.

* Saves file download status so that you can start from where you stopped. No need to redownload the complete file.

* In case data is not recieved for some time the download timesout

# Version 0.2.0
*	This has become a nodejs lib and now can be used through the code only *(In case you want to use the command line version you will might have to wait)*.
*	Code has been refactored.

# How to use

Downloads are of two types.

1. 	**New Download:** In a new download you have to provide all the download information. Once the download start it will create a new file which will have a **.mtd** extension. This file will contain some meta information regarding the download.

		
```javascript
var mtd = require('mt-downloader');

var options = {
// Total number of download threads, default: 32
count: 32, 

// Http method for download (GET, POST), default: GET
method: 'GET',

//Default Http Port, default: 80
port: 80,

//Set the range of data in percent that you want to download (Eg: 0-50)
//default: 0-100
range: '0-100',

//Download stops if no data is received for this duration of time
timeout: 5000,

};

var url = 'http://joaomoreno.github.io/thyme/dist/Thyme-0.4.2.dmg';
var file = '/Users/tusharmathur/Desktop/temp/Thyme-0.4.2.dmg';

var downloader = new mtd(file, url, options);

//Set a call back function that is to be called when the download finishes.
download.callback = function(err, result){
console.log('Download complete');
};


//To start te download
downloader.start();
```		



2. 	**Re-Download:** This is when you want to restart a download. The download started from where it had stopped the last time.
	
	
```javascript
var mtd = require('mt-downloader');

//Open a file with **.mtd** extension.

var file = '/Users/tusharmathur/Desktop/temp/Thyme-0.4.2.dmg.mtd';
var downloader = new mtd(file);

downloader.callback = function(err, result){
	console.log(result);
};

downloader.start();
```



## Issues or Feature Requests?
   Feel free to create one [here](https://github.com/tusharmath/Multi-threaded-downloader/issues/new)
      
<iframe src="http://ghbtns.com/github-btn.html?user=tusharmath&repo=multi-threaded-downloader&type=fork&count=true"
  allowtransparency="true" frameborder="0" scrolling="0" width="auto" height="auto"></iframe>   
