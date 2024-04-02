---
layout: post
category: OperatingSystems
lastUpdated:
---

Based on the paper *Experiences with Processes and Monitors in Mesa*[^1] by Lampson and Redell, published in the Communications of the ACM in 1980. Note that the "processes" in the paper are actually... *threads*!

## Table of contents
- [Overview](#overview)
- [Message passing or shared memory?](#message-passing-or-shared-memory)
- [Non-preemption](#non-preemption)
- [Hoare v. Mesa Semantics](#hoare-versus-mesa-semantics)
- [Issues with Mesa](#issues-with-mesa)
- [Conclusion](#conclusion)
- [Sources](#sources)

## [Overview](#overview)
When Xerox came out with its Xerox 8010 Information System (aka Xerox Star)[^2], it built its Pilot Operating System using the Mesa programmming language. Keep in mind that Mesa (and thus Pilot) was designed for a system which supported only one user, as opposed to the timesharing required by mainframes. Some of the design decisions make more sense with this perspective in mind.

## [Message passing or shared memory?](#message-passing-or-shared-memory)
Before we jump in, if you'd like a recap of our synchronization primatives, give [this post](synchronization-review.html) a look! :)

Redell & Co. started out deciding to use shared memory for reasons I don't quite buy: it was easier on the type system and control flow of Mesa. **ask about this in OH**

### Message Passing
When processes access a shared resource, they send a message out to all of the other affected processes.

### Shared Memory
With shared memory, processes 

For example, in Mesa "the address of the condition variable [is stored] in a fixed memory location" (pg 12)[^1] which all processes can access with the proper lock.

### Tradeoffs
With message passing, data from each process is better isolated and *you know when a variable is touched*.
<!-- do you? I don't know how to explain that there's more transparency between processes -> less unexpected behaviors -->

There's also an issue if the message queue fills up, which makes message passing viable only when a few messages will be exchanged. 
<!-- would this ever be the case with concurrency communication? maybe that's why they didn't take this approach. -->

Shared Memory                        | Message Passing
-------------------------------------|-------------------------------------
- less overhead | - more overhead (finding process(es) to send messages to)
- worse protection/isolation (any process can touch the memory) | - better process isolation

## [Non-preemption](#non-preemption)
- why it's an issue in a virtual memory system
- how it relates

## [Hoare versus Mesa Semantics](#hoare-versus-mesa-semantics)
- mesa easier to implement!
- nested `wait`s make hoare difficult
- hoare is more mathematical, mesa is more practical
- how to deal with starvation/priority inversion?

## [Issues with Mesa](#issues-with-mesa)
- livelock (can use processor, but don't make any progress)
- exceptions
- deadlock

## [Conclusion](#conclusion)
- when do we use these today
- what were the effects of the design decisions
    - what made them sob in hindsight
- why was the paper so notable?

## [Sources](#sources)
[^1]: The paper itself, *[Experience with Processes and Monitors in Mesa](https://people.eecs.berkeley.edu/~brewer/cs262/Mesa.pdf)*
[^2]: Wikipedia article on the [Xerox Star](https://en.wikipedia.org/wiki/Xerox_Star#Hardware)
[^3]: MIT [Concurrency Reading](http://web.mit.edu/6.005/www/fa14/classes/17-concurrency/) for the Software Construction class
