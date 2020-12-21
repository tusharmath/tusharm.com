```metadata
title: Lessons learnt from driving a healthy code review culture in organizations
date: 2020-Dec-16
template: article.pug
category: article
```

Code reviews in organizations are quite different and more challenging in my opinion than typical open-source projects. Here are some of the things I have learnt from my experience, that helped to ensure an effective, resilient and healthy culture around code reviews

## 🥴 Organizational Challenges

- More often than not, people of different levels of skills & experiences contribute to the same code base.
- There is an explicit hierarchy within the team (captain, manager etc.) that can influence the review process.
- Very often you are working with folks who are trying to meet an external deadline on a project that has not yet found a product-market fit.
- Some projects are green-field, so there is less structure both in terms of code and organization. Setting up standards too soon might turn out to be counter productive.
- Similarly some projects are huge, monolithic legacy systems with teams that are used to certain kinds of processes and setup.

## 💃 Organizational Advantages

- For starters, most of the developers are working on the same floor, in the same time zone. This is a massive collaboration booster, as there is less time spent in writing one-time-read documentations, articulating your arguments or waiting for someone to respond to your queries.
- The folks you are working with are not contributors who are "donating" their time to your project. They are engineers who are committed to work with you to achieve a common goal long term.

## 😇 Driving Review Culture

- Code reviews should be looked at, as a part of your engineering culture rather than a process.
- Developers should feel safe to communicate their opinions, whether they agree or disagree with something.
- Some people that you collaborate with might be new to the project or technology. For them, code reviews should be centered around making them learn and onboard faster.
- Encourage people in their initial reviews. Sending a congratulatory note publicly, on someone's first PR getting merged or for some long stuck PR, really helps!
- The collaboration is non-transactional. It's not just this one PR that needs your review, there are going to be many more across multiple projects. Building a healthy rapport with your peers turns out to have a long term impact.

## 🗣 Effective Communication

- Derogatory or offensive feedback should be flagged.
- Nitpicking should be marked explicitly, use **#nitpick** if you want to be extra clear.
- Review feedback should emphasize on facts instead of feelings and opinions.
- Exploit the fact that the developers are on the same floor. Block your calendar and have a face to face discussion instead of doing it over tools (Github, Gitlab etc.).

## 💁‍♀️ Focusing on Peer Reviews

- Hierarchical reviews (eg. captain reviewing her team) should be avoided as much as possible.
- All reviews should be preferably done within your team and amongst peers.
- There should be minimum dependencies between teams for pull request approvals.

## 📝 Having a Developer Guideline

- If you don't have it, create one! They are the most effective way of improving code review efficiency.
- Investing time in it, reviewing it frequently, and making it a part of the onboarding process saves a lot of time later.
- It's sometimes better to have a coding guidelines that is easier maintain because of already available tooling.

## 👮‍♀️ Creating Domain Owners

- Create specific owners for certain parts of your software.
- Owners' approval should be necessary for any changes made to those pieces.
- Don't have only one owner for anything 😓

## 🤷‍♀️ Distinguishing between Subjective vs Objective Feedback

- There should be a very clear distinction between Objective and Subjective feedback while sharing it with the contributor. Use tags such as **#IMO** ie. "In my opinion", or **#IMHO** ie "In my humble opinion"
- Objective feedback is the one that has been agreed upon as a group. It is in adherence to the project's contribution guidelines. It flags — logical deficiencies, performance issues, high maintenance or reliability costs. It should remain **non-negotiable**.
- Subjective feedback is an opinionated way of doing something. This should not be mandated even if it's given by the domain owner or your captain.
- This distinction can save a lot of [bike shedding] time later.

[bike shedding]: https://en.wiktionary.org/wiki/bikeshedding

## 🧐 Reviewing Context

- It's easy to get distracted and start providing feedback about stuff that's already running in production.
- This should be completely avoided.
- Open an issue on Jira (you are not an org otherwise 😇) if you want to propose a change in existing code.

## ⏱ Deferring Proposed Changes

- Sometimes, the proposed changes are quite large and contributors need to meet external deadlines.
- The contributors should be allowed to make an issue (on Jira!) for follow-up changes after the current PR is merged.
- Alternatively use a TODO comment with a due date and name tag eg: **TODO(1-JAN-2020@tusharmath)** inside the codebase. Setup lint rules on the CI that flags such todo comments when the due date is missed.

## 🛠 Leveraging Tooling

- Tooling is critical in making reviews efficient. Be open to explore paid tools that help in collaborating and reviewing better.
- Anything that can be automated should be automated.
- Running tools locally as a pre-commit hook, works well for small projects but integrating with CI is a must for large projects.
- Maintain historical data of your builds. Push your code metrics such as build time, artifact size, test coverage, flaky tests, files changed etc. to an external analytics system.
