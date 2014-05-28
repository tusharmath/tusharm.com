```metadata
title: Programming Schedules
author: tushar-mathur
date: 2014-may-28
category: articles
template: article.jade
```
I was going through a use case once, where in the user would want to book an appointment with a doctor. Actually book repeated appointments. This is a every common scheduling problem where you want to schedule repeated events on a calender. The issue is that there isn't a generic framework which takes care of all the possible scenarios '*Elegantly*'.

For Eg. Consider a patient who wants to book an appointment for every saturday. It's simple - Have an appointment for staturday, repeated weekely. No problem at all, right?

Now, consider he wants to do it every third saturday. Again no problem - schedule an appointment for saturday, repeated every 21 days.

But what if the doctor is not available on the last day of every month? So incase the sat is also the last day of the month, there shouldn't be an appointment.

You must know where I am getting at, if you have thought about the plethora of use cases one would end up handling. There are way too many complex scenarios which take into account number of days in a month, if it's a leap year, last day of the month, etc. After thinking about it on and off for a week, I realized that its pretty much impossible to give something which is so generic that it covers 100% of the cases.

There is another problem - How do I save these events? Should I create all the appointments in advance based on the rules and then save them one by one into the db? Wouldn't that be redundant if you know the data actually follows a pattern?

One fine day, I was looking at my chrome dev tool's elements panel and realized, this is not only faced in scheduling events but also when you want to select dom elements via a css selector. This is what inspired me to setup an esoteric programming language like css or even LESScss, which could be used explicitly for creating schedules with repeated events.

Imagine you have a calender built using html. You have years represented a `y` tags, months as `m` weeks as `w`, days as `d` and son on.

    y.leap .current
    m.jan, .feb ...., .31d, 30d, 28d, 29d .current
    w .current
    d, .sat, .mon ... .current


Yearly repeated on the 45th day
```
y d[45] _1700
```

Monthly 2nd sat
```
m d.sat[2] _1600
```

Monthly 1st sat
```
m d.sat[first] _2100
```

monthly last sat
```
m d.sat[last] _1800
```

monthly all sat
```
m d.sat _1400
```

every 3rd months 2nd sat
```
m[3n] d sat[2] _1300
```

every 1st of every month
```
m d[1] _1800
```

Every alternate month second week, first mondays
```
m[2n] w[2] d.mon _1700,
m[2n+1] w[3] d.sun[first or 1] _1500
```

23rd of each month
```
m d[23] _1800
```

100th day of each year
```
y d[100] _1500
```
14th Feb every yr
```
y m[1] d[14]
```

every month  12th day
```
m d[12]
```
every jan, feb, mar weekdays
```
m[-n+3] d[n+1][-n+1]
```

every month first sat after 12th
```
m d.sat[n+12, 1]
m d.sat[n+12][-n+19]
```
(m d.sat[n+12])[1]


4th april 2016
```
y.2016 m[4] d[4] _0800
```

31st day is tuesday
```
m d.tue[31]
```

Second sat is 12th
```
m w[2] d.sat[12]
```

sat of a month if it is 10th
```
m d.sat[10]
```

15 days from the last week of this month
```
y[2014] {
    m.may d[n+26],
    m.jun d[n+10]
}
```
x = m.current w[last] d[first]
y.current d[n+x]