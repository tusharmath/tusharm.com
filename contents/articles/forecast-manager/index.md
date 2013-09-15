```metadata
	
title: Javelin Forecast Manager
author: zs-associates
date: 2011-06-01
category: project
template: project.jade
```

Forecast Manager was my second project in [Z.S. Associates](http://zsassociates.com). It was a MVC .Net based web application that would help in maintaining forecasting models. These models were designed in MS Excel and could be merged with each other and to create different versions. The application could also render reports on the web and could help in managing access rights in an extremely customized way per user and per client basis.

The team size was very dynamic but I was the oldest member of the team and knew the inside out of the web application. As a developer I had two roles- 

1. **Design and develop features:** I had to convert business needs into technical requirements and research on each feature throughout the full software development cycle. _I worked on multiple features which I will list later_. Development was done in C# mainly. On the UI side we used knockout.js and jQuery to maintain a MVVM design pattern. On the database side we used Entity Framework as an ORM on top of SQL Server 2006.
2. **Automate the deployment process:** I developed Powershell scripts to be executed on Teamcity so as to automate the process of deployment which effectively reduced the deployment time by 98.7%. Since we had around fifty instances of the application and upgrading all of them in one go would take a lot of time more over we had the overhead of maintaing multiple webconfigs which had to be manually modified every time we upgraded, as all the customizations per client we set in the web.config file. Even our tag creation was not automated initially and since our teams were so dispersed geographically it was very difficult to share signed releases. With all the automation scripts in place we saved around eight man hours weekly.