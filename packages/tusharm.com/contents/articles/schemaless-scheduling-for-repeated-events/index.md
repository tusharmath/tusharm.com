```metadata
title: Schemaless scheduling for repeated events

date: 2014-may-28
category: project
template: project.pug
```

Consider a case where one wants to schedule repeated events in a calendar. For example - a yearly birthday or a fortnightly appointment with the dentist. Though, these cases are quite simple and most of the current solutions such as — Google Calendar, handles them quite well, the problem arises when you want to integrate a system like this with your own application.

This stackoverflow question — [Calendar Recurring/Repeating Events - Best Storage Method](http://stackoverflow.com/questions/5183630/calendar-recurring-repeating-events-best-storage-method) — gives a good picture of the complexity of the problem.

One thing that I observed, is that you could draw parallels between this problem and the problem of selecting elements in a DOM tree. The latter been solved already using css selectors. So I started developing a language inspired by CSS Selectors but tailored for selecting dates.

This language ultimately gave me a lot of flexibility in terms of writing repetition logic and applying filters. Moreover this setup din't require any complex schema and thus no schema migrations, with every new feature. Its just one rule, defining any convoluted logic as you may like and still taking up only a single row in the table.

The [rules](https://github.com/tusharmath/sheql/wiki/Rules) for the language (Named it SHEQL) and a parser prototype has been [open sourced](https://github.com/tusharmath/sheql) and is also available via npm. Though the prototype has been written in javascript one could easily write a version in python or some other language.
