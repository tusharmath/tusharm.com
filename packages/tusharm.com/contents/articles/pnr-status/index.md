```metadata
title: Get PNR Status
author: tushar-mathur
date: 2013-09-7
category: project
template: project.jade
```
I had booked my train ticket to Ajmer from Vadodara where I was staying with my aunt. The booking status was *waiting* and my berth was not confirmed. I had booked it a day before I was travelling and my aunt was getting paranoid about checking the status of my ticket again and again. She would come every 15 minutes and ask me to check the status of the ticket online and it wasn't her fault actually, because even though Indian Railways is one of the biggest mode of commuting in the world most of the times you won't get berth in the train. So with no fault of her own she was a little worried about it :) and I would have to go to [this](http://www.indianrail.gov.in/pnr_Enq.html) sucky website, enter my PNR Number, submit and wait for a response. Every time I would submit my PNR Number there would be popups all over the place. The overall experience of getting the booking status was just too pathetic for me. So I decided to make an app that would do this crappy work by polling the server every 15 minutes and show me the latest status of my ticket.

## The app

I created this console app - [pnr-status](https://npmjs.org/package/pnr-status) with Node.js. Its a simple app which just tells you the PNR status(Indian Railways only). There were quite a few browser extensions that were present. Unfortunately I din't like them either since they were too slow.

*I had a hidden motive to make this app - I wanted to build something with CoffeeScript ;)*

## How is this different?
Well, this keeps polling the server for the latest status and displays it on the console screen.

## Installation

```bash
npm install -g pnr-status
```

## Usage

Simple pass the PNR number as a parameter to the ```pnr-status``` command.
```bash
pnr-status 8216477093
```

## Interesting Features
Here is list of interesting features that I would want to add later.

* Notify via email, msg or call once the ticket is booked.
* Add a web version

Feel free to share some more features that would be interesting [here](https://github.com/tusharmath/pnr-status/issues) or in the comments below.


# Update:

I developed a desktop application for Mac. Now I am working on a [chrome app](https://github.com/tusharmath/chrome-pnr-status) since that would be smaller in size,  more updates on it later. Check out the snapshot in the mean time.

![image](snapshot.jpeg)
