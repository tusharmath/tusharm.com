```metadata
title: ShareBill
author: tushar-mathur
date: 2012-nov-10
category: project
template: project.jade
```

I had a couple roommates back when I was working in ZS Associates. I had faced a lot issues while calculating shared expenses. Since I always wanted to make sure that we din't make any mistakes in our calculations I spent some time in creating a Google Doc Spreadsheet for it. It worked fine as it served my purpose and the purpose of some of my friends. The problem was that it was just not the right thing to use if you had more than four people in the group which shared expenses. It looked ugly, would be really slow and any one could tamper the formulas.

<span class="more"/>

I felt that there should be some software out there that should be more sophisticated than the Google Doc that I had made. I started searching for some app or a website which could do these calculations for me. Unfortunately I din't find any site through googling. I was amazed by the fact that I couldn't find any! So I decided to build one of my own. I just wanted it to start have basic features. Once I created my first version I showed it to a friend of mine and that's when he told me about [Bill Monk](http://www.billmonk.com/). I was devastated, I felt that I had wasted a lot of energy in building something which was already there.

I soon decided that I will not give up and make my site much better, I will add all the features that BillMonk din't have. I will use HTML5 to make it perform better! In a period of around 2-3 months I came up with this app - [Sharebill](http://sharebillv2.apphb.com/)

![Resize icon][2]

In the process of making this application I learnt about the importance of using a Javascript framework for UI manipulations. I had chosen [Knockout.js](knockoutjs.com) and this is the first time I had used a MVVM framework in any of my apps. To make it work better than Bill Monk I used the *localStorage* and *application cache* apis to cache all the data locally which improved the performance significantly. I would also show realtime updates of what changes others were making to the transaction.

*Funny part:* I was so slow at making this app that I worked on it for almost a year! I re-wrote the complete app multiple times and by that time BillMonk was bought by some company and they had come up with a new product - **BillPin** which even had an iPhone app! Fortunately or unfortunately I din't want to develop this app any more because I had found things that were more interesting.

[2]: 1.png 






