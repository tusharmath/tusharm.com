```metadata
	
title: Get PNR Status
author: tushar-mathur
date: 2013-09-7
category: project
template: project.jade
```
I had booked my train ticket for Ajmer from Vadodara where I was staying with my aunt. The booking status was *waiting* and my berth hadn't been confirmed. I had booked it a day before I was travelling and my aunt was getting paranoid about checking the status of my ticket. She would come every 15 minutes and ask me to check the status of the ticket online and I would have to go to [this sucky website](http://www.indianrail.gov.in/pnr_Enq.html) and enter my per status, submit and wait for a response. Moreover every time I would submit my pnr number there would be popups all over the place. The overall experience of getting the booking status was just too pathetic for me. So I decided to make an app that would do this crappy work by polling the server every 15 minutes and show my the latest status of my ticket.

I created this console app - [pnr-status](https://npmjs.org/package/pnr-status) with node.js Its a simple app which just tells you the PNR status of your railway ticket (Indian Railways only). There were quite a few browser extensions that were present. Unfortunately I din't like them either since they were too pretty slow to respond.

*I had a hidden motive to make this app - I wanted to write something in CoffeeScript ;)*

##How is this different?
Well, this keeps polling the server for the latest status and displays it on the console screen.

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
* Add a web version

Feel free to share some more features that would be interesting 