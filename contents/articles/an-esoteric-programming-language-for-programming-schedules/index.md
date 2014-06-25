```metadata
title: Scheduling repeated events
author: tushar-mathur
date: 2014-may-28
category: articles
template: article.jade
```

Consider a case where one wants to schedule repeated events in a calender. For example - a yearly birthday or a fortnightly appointment with the dentist. These case are quite simple and most of the current solutions such as google calender, handles them quite well. The problem arises when you want to build a system like this with your own application.

To give you a perspective of the complexity of the problem, consider a case where I have repeated appointments on every saturday for 3 years. Which means I would have to create a db schema where in I would have 156 entries (approx 156 saturdays in 3 years). They also have to be linked to some base type of an entry so that incase if I update the time or notes for one event and want to let it cascade to all the events in the future, I should be able to do so. Which means, again a change in 156 rows of the table. It only gets worse if you have more complex forms of repeatition logic such as involving last day of the month except if its a friday etc.

After spending some time on this problem, I realized that selecting a day from a calender range, is pretty much like selecting an element from the dom tree in the browser. Infact if I made web page with a collection of `year` elements, each having twelve `month` as its child element and then `week` and eventually `days`, then I could just use a css selector to find the day relevent to me. This gives me an added benifit of creating an even more customized version of the repeatition logic. I can literally now program my schedules using this language.

I have created an open source version of the rule book and have put it on [github](https://github.com/tusharmath/sheql).