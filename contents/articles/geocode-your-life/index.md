---
title: Geocode your life
author: tushar-mathur
date: 2013-sep-3
template: project.jade
category: project
---
I wanted to write this blog about one of my undergrad projects - **Paunkie**.

I was working as an intern in [Indigo Architects](http://indigoarchitects.com/) and was learning web development. I worked on multiple projects while I was there and **Paunkie** was one application I built to showcase some of the things that I had learnt.

The concept of **Paunkie** was to *Geocode you life*. Basically everything you did could be pinned to the map and shared within your social network. You could visualise the things you have done in the past geographically. 

##Summary
* You could share your location with people and see their current locations.
* You could also know where all your friends are and the places that were popular amongst them.
* Based on your profile and your friends profile, the app would suggest people you might know and places you might want to visit. All the results were dynamic in nature so when ever your location would get updated you would get recommendations based on your new location.
* I used asp.net MVC3, and loads of JavaScript and [jQuery](http://jquery.com).
* I worked extensively on making the user interface responsive and also tried to utilise maximum screen real estate on the screen as the app was all about visualising your social connections in an aesthetically appealing way.
* It was quite essentially a social networking website which was based on Google Maps. 
* It was designed as *Single Page App* with loads of JavaScript communicating with web services. This is the time when HTML5 standards had not come up and none of the browsers had native support for such powerful features like *push state, web workers*.

I worked on it for around a month and this is what I came up with...

##Home Screen
![image](2.jpg)

##Send and receive messages
![image](3.jpg)

##Adding some place you have visited
![image](4.jpg)

##See your location
![image](5.jpg)

Unfortunately there were other things that started interesting me more and I had to stop developing this application.