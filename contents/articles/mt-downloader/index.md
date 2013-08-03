---
title: Node.js Mt Downloader
author: tushar-mathur
date: 2013-08-3
category: career
template: project.jade
---

Why would someone want a **multi threaded downloader**? Well, the answer is quite simple - To increase download speed.

What it really does is, it makes multiple connections with the server from where the file has to be downloaded. Now since data is sent in packets on those connections. There is always little bit of a lag between these packets. This especially happens if you have a low speed internet connection or there are multiple applications using the internet at the same time.

When you make multiple connections you minimize that lag period because at any given instance there is at least one thread which is delivering a packet of data. This helps in efficient use of the bandwidth. You won't get a speed more than that allotted by your ISP using this process.

There are quite a few multi threaded downloaders such as [wxDownload](http://dfast.sourceforge.net/) and [Progressive Downloader](https://www.macupdate.com/app/mac/33754/progressive-downloader) but they din't really have the flexibility that I wanted in my downloader. I needed something more than just a simple multi threaded downloader. I needed something which could let me stop and resume downloads from the last downloaded byte even if I restarted my computer. There were some downloaders which had these features but I also wanted something which had an api and could be used with my other projects.

So I created this node.js based http-downloader - [mt-downloader](https://github.com/tusharmath/Multi-threaded-downloader). One very important reason for making this was that I also wanted to learn **node.js** and **improve my javascript skills** which I did eventually. 

  
Once the library was completed I also created a thin console based wrapper around it and called it [mt-console](https://github.com/tusharmath/mtd-console). This is what I use for my downloads now.

![image](mt-console.png)