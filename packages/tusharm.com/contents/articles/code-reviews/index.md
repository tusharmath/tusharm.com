```metadata
title: Driving a healthy code review culture in organizations
date: 2020-Dec-16
template: article.pug
hide: false
category: article
```

Code reviews in organizations are quite different than typical open source projects:

- There are external deadlines to deal with.
- People of different levels of skill contribute to the same code base.
- There is an explicit hierarchy within the collaborators (captain, manager etc.) that affects design decisions.

Here are some of the things I have learned from my experience, that helped ensure a healthy culture around code reviews

## 🗣 Communication

- People, should be allowed to communicate if they agree or disagree with something.
- Derogatory, rude, and offensive feedback should be flagged.
- Feedback should emphasize on facts instead of feelings and opinions.
- Prefer face to face debates instead of doing it online (Github, Gitlab etc.)

## 💁‍♀️ Peer Reviews

- Hierarchal reviews (eg. captain reviewing the contributor) should be avoided as much as possible.
- All reviews typically should be preferably done within your team and within peers.
- There should be minimum dependencies between teams for pull request approvals.

## 📝 Contribution Guidelines

- If you don't have it, create one!
- They are the most effective way of improving code review efficiency.
- Investing time in it, reviewing it frequently, and making it a part of the onboarding saves a lot of time later.

## 👨‍✈️ Domain Owners

- Create specific owners for certain parts of your software.
- Owners' approval should be necessary for any changes made to those pieces.
- Don't have only one owner for anything 😓

## 🤷‍♀️ Subjective vs Objective Feedback

- There should be a very clear distinction between Objective and Subjective feedback while sharing it with the contributor.
- Objective feedback is the one that has been agreed upon as a group. It is in adherence to the project's contribution guidelines, is logically correct, or is objectively superior in terms of performance, maintenance or reliability. It should remain **non-negotiable**.
- Subjective feedback is an opinionated way of doing something. This should not be mandated even if it's given by the domain owner or your captain.
- This distinction can save a lot of bike shedding time later.

## 🧐 Review Context

- It's easy to get distracted and start providing feedback about stuff that's already running production.
- This should be completely avoided.
- Open an issue on Jira (you are not an org otherwise 😇) if you want to change existing code.

## ✋ Deferring Proposed Changes

- Sometimes, the proposed changes are quite large and contributors needs to meet external deadlines.
- The contributors should be completely allowed to make an issue (on Jira!) for followup changes after the current PR is merged.
- Alternatively use a TODO comment with a due date and name tag eg: `TODO(1-JAN-2020@tusharmath)` inside the codebase.
- Setup lint rules on the CI that flags such todo comments when the due date is missed.

## 🛠 Tooling

- Tooling is critical in making reviews efficient
- Anything that can be automated should be automated.
- Use CI for running unit tests, linters, formatters etc.
- Keep a check on coverage information.
