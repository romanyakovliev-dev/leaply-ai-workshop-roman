---
name: brainstorm
description: Help the user converge on a sharp, small, buildable idea before writing any code. Trigger when the user is vague ("I want to build something with AI", "help me think of an idea", "not sure what features"), or proposes a scope that's clearly too broad for one session. Goal is to narrow scope, not to write a strategy doc.
---

# Brainstorming the idea (before coding)

The user wants to build something but hasn't pinned down what exactly.
Your job is to help them converge on a **small, sharp, buildable idea**
fast — not to write a product brief, not to "explore the space". The
worst outcome of this skill is a long, fancy plan that never ships.

## Trigger signs

- _"I want to build an app but I'm not sure what."_
- _"Help me come up with an idea."_
- _"I want to do something with AI / dashboards / e-commerce — what
  would be cool?"_
- A scope that's clearly multi-week dressed up as a workshop idea
  (_"a Notion clone with AI"_, _"a full CRM"_).

## How to run it

Ask **one short question at a time**. Two or three rounds is the
target. Don't dump a survey.

### Round 1 — Who's the user, and what one pain do they have?

> _"Who is this for, and what's the one annoying moment in their day
> this would fix? Don't think 'product' — think 'one specific moment'."_

If they answer with a feature list, push back: _"Let's start with the
moment, not the feature. When does someone reach for this?"_

### Round 2 — Smallest interesting demo

Once the moment is clear, propose **the smallest version that's still
interesting to look at**:

> _"OK — for [the moment], the smallest thing that would feel real is
> probably [one screen / one input / one output]. Everything else is
> a bonus. Want me to start there?"_

Examples of "smallest interesting":

- Idea: _"a workout app"_ → Smallest: a single timer screen that
  remembers the last 5 workouts in localStorage.
- Idea: _"AI sales assistant"_ → Smallest: a chat box that answers
  one canned question well using one API call.
- Idea: _"team retrospective tool"_ → Smallest: an anonymous post-it
  board on a single URL, no auth.

### Round 3 (only if needed) — Cut everything else

If the user starts piling features back on:

> _"All of those make sense for v2. For today, we ship just the
> [smallest version]. Once it's live and you've shown it to one
> person, we'll know what to add next. Deal?"_

Get a "yes" before proceeding. Then move on — usually to the
`frontend-design` skill (to pick a visual direction) or straight to
coding the first screen.

## Output shape

After brainstorming, you should leave the user with **one paragraph**
in this shape:

_We're building: a [thing] for [user] that lets them [single action].
Today's scope: [one screen / one feature]. Out of scope for now:
[list of 2–3 obvious cuts]._

Paste that back to them and ask for a thumbs-up before opening any
file. It's the contract for the rest of the session.

## What you must NOT do

- ❌ Write a multi-page brief, lean canvas, or "product spec". This
  is a coding session, not a strategy workshop.
- ❌ Propose 10 ideas in a numbered list. Two distinct options max,
  or one focused suggestion.
- ❌ Ask the user to "validate the market" or "talk to 5 users". Out
  of scope.
- ❌ Default to the same idea every time (a todo list, a chat app,
  a Pomodoro timer). If you find yourself reaching for one of those,
  challenge yourself for something more specific to the user.
- ❌ Move on to design or code while the scope is still fuzzy. A
  vague brief produces a vague app. Insist on the one-paragraph
  contract first.
