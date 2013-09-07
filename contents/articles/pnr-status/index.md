---
title: Get PNR Status
author: tushar-mathur
date: 2013-09-7
category: project
template: project.jade
---

I created this console app - [pnr-status]() with node.js 

Its a simple app which just tells you the PNR status of your railway ticket (Indian Railways only). The main reason that I created this app was that, that the original [website](http://www.indianrail.gov.in/pnr_Enq.html)  was slow and I just hated the ubiquitous popups and advertisements. I wanted something cleaner at the same time I also wanted something fast.

There were quite a few browser extensions that were present. Unfortunately I din't like them either since they were too slow to respond.

##How is this different?
Well, this keeps polling the server for the latest status and displays it on the screen.

##Installation

```bash
npm install -g pnr-status
```

##Usage

Simple pass the PNR number as a parameter to the ```pnr-status``` command.
```bash
pnr-status 8216477093
```

##Interesting Features

* Notify via email, msg or call once the ticket is booked.

Feel free to share some more features that would be interesting 