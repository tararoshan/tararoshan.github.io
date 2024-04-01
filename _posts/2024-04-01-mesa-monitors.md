---
layout: post
category: OperatingSystems
lastUpdated:
---

Based on the paper *Experiences with Processes and Monitors in Mesa* by Lampson and Redell, published in the Communications of the ACM in 1980. Note that the "processes" in the paper are actually... *threads*!

## Table of contents
- [Overview](#overview)
- [Message passing or shared memory?](#message-passing-shared-memory)
- [Non-preemption](#non-preemption)
- [Hoare v. Mesa Semantics](#hoare-versus-mesa)
- [Issues with Mesa](#issues-with-mesa)
- [Conclusion](#conclusion)
- [Sources](#sources)

## [Overview](#overview)
When Xerox was coming out with its new Xerox 8010 Information System (aka Xerox Star), it set out building the Pilot Operating System using the Mesa language. At the time, Xerox Star was marketed as a personal computer with a GUI. Keep in mind that Mesa (and thus Pilot) was designed for a system which supported only one user, as opposed to the timesharing required by mainframes. So some of the design decisions make more sense with this perspective in mind.

## [Message passing or shared memory?](#message-passing-shared-memory)
Before we jump in, if you'd like a recap of our synchronization primatives, give [this post](synchronization-review.html) a look! :)

Redell & Co. started out deciding to use shared memory for reasons I don't quite buy: it was easier on the type system and control flow of Mesa. **ask about this in OH**

### Message Passing


### Shared Memory

### Tradeoffs

## [Non-preemption](#non-preemption)
- why it's an issue in a virtual memory system
- how it relates

## [Hoare versus Mesa Semantics](#hoare-versus-mesa)
- mesa easier to implement!
- nested `wait`s make hoare difficult
- hoare is more mathematical, mesa is more practical
- how to deal with starvation/priority inversion?

## [Issues with Mesa](#issues-with-mesa)
- livelock
- exceptions
- deadlock

## [Conclusion](#conclusion)
- when do we use these today
- what were the effects of the design decisions
    - what made them sob in hindsight
- why was the paper so notable?

## [Sources](#sources)
- The paper itself, *[Experience with Processes and Monitors in Mesa](https://people.eecs.berkeley.edu/~brewer/cs262/Mesa.pdf)*
- Wikipedia article on the [Xerox Star](https://en.wikipedia.org/wiki/Xerox_Star#Hardware)
- MIT [Concurrency Reading](http://web.mit.edu/6.005/www/fa14/classes/17-concurrency/) for the Software Construction class
