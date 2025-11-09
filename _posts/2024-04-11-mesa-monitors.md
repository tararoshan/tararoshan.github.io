---
layout: post
category: systems
lastUpdated:
---

Based on the paper *Experiences with Processes and Monitors in Mesa*[^1] by Lampson and Redell, published in the Communications of the ACM in 1980. Note that the "processes" in the paper are actually... *threads*!

<!-- Explain why the paper is worthwhile and why the post is worth reading -->
<!-- example of diff in theory v. implementation in computing
getting a better understanding of system design, with a focus in synchronization/concurrency -->

<!-- read the ending where they talk about queues and write that up as well -->

## Table of contents
- [Overview](#overview)
- [Message passing or shared memory?](#message-passing-or-shared-memory)
- [Non-preemption](#non-preemption)
- [Hoare v. Mesa semantics](#hoare-versus-mesa-semantics)
- [Monitor procedures](#monitor-procedures)
- [Issues with Mesa](#issues-with-mesa)
- [Conclusion](#conclusion)
- [Sources & Notes](#sources--notes)

## [Overview](#overview)
When Xerox came out with its Xerox 8010 Information System (aka Xerox Star)[^2], it built its Pilot Operating System using the Mesa programming language. Keep in mind that Mesa (and thus Pilot) was designed for a system which supported only one user, as opposed to the timesharing required by mainframes. Some of the design decisions make more sense with this perspective in mind.

<!-- give TLDR of monitor -->
Before we jump in, if you'd like a recap of our synchronization primatives, give [this post](synchronization-review.html) a look! **TODO write the post and update link** :)

## [Message passing or shared memory?](#message-passing-or-shared-memory)
Redell & Co. started out deciding to use shared memory for reasons I don't quite buy: it was easier on the type system and control flow of Mesa. I'll go over both of these below.

### Message Passing
When units access a shared resource, they send a message out to all of the other affected units. The messages are then queued up by the receiving units to be handled when they wake up.

### Shared Memory
With shared memory, units communicate by editing some piece of shared memory that they all have access to.

For example, in Mesa "the address of the condition variable [is stored] in a fixed memory location" (pg 12)[^1] which all threads can access with the proper lock.

### Tradeoffs
Both message passing and shared memory can be used for processes and threads. However, in terms of implementation, shared memory seems harder for processes (we isolate them for protection) and easier for threads (of the same process, they share the same process address space).[^3]

With message passing, data from each unit is better isolated and you know when a variable is touched (because you receive a message).
<!-- do you? I don't know how to explain that there's more transparency between processes -> less unexpected behaviors -->

However, message passing is viable when only a few messages will be exchanged, since the message queue could fill up. 
<!-- would this ever be the case with concurrency communication? maybe that's why they didn't take this approach. -->

Shared Memory                        | Message Passing
-------------------------------------|-------------------------------------
- less overhead for threads | - less overhead for processes
- worse protection/isolation | - better process isolation

For a more in-depth analysis, I'd recommend [this article](https://noobtomaster.com/operating-system/shared-memory-and-message-passing/).

## [Non-preemption](#non-preemption)
Why bother with monitors, anyways? Multiprocessors aside, we need to be able to handle interrupts and still preserve critical section data in system with virtual memory.

To see why interrupts would arise in such a system *even if we use non-preemptive scheduling*, consider page faults. Processes (and threads) don't know when they're about to access memory that hasn't been paged in, so page faults are essentially arbitrary interrupts. To have virtual memory is to have interrupts.[^4]

More importantly, allowing for preemption makes your code more modular. Functions are only responsible for their own code, eg. they don't have to worry if their callees will `yield`. This makes coding with monitors more flexible and maintainable.

## [Hoare versus Mesa semantics](#hoare-versus-mesa-semantics)
Today, there are two major types of monitors: Hoare and Mesa. Hoare monitors were created by [Tony Hoare](https://en.wikipedia.org/wiki/Tony_Hoare). Its successor Mesa, as you would expect, was the type created and used by the authors of this paper.

The two variations differ in their semantics of
1. who gets the lock and CPU (the signaller or the waiter)
2. how are nested `signal`s handled

**Which one are you: Mesa or Hoare? Take the quiz below to find out!**
1. You're a thread executing a process and you call `monitor.signal()`. What do you do?

    A. I'm still in control, of course! I'll let all of the waiters know that their resource is available now, but I'm still going to keep executing.

    B. Oh shoot, guess I need to give up control now so that other threads can run.
2. You've called `monitor.signal()` and control was given to another thread. Now *that* thread also called `monitor.signal()`!
    
    A. Wait, what? This shouldn't even be possible?!
    
    B. Well, just carry on. Do what we did when we saw our first `signal`.

<details>
<summary>Quiz Results</summary>
If you answered <b>A</b> to both questions, you're a <b>Mesa</b> monitor!
<br><br>
If you answered <b>B</b> to both questions, you're a <b>Hoare</b> monitor!
</details>

Hoare monitors give the lock and CPU to the *waiter* and return them to the signaller once the waiter has finished. This requires a context switch so that the signalling process is suspended. This also means that nested `signals` are possible.

In comparison, Mesa monitors put the waiter on a ready list and the signaller keeps the lock and processor. Sometime later, the waiter is scheduled and given the CPU.

As you might expect, Mesa monitors are more straightforward to implement:[^5]
```python
class MesaMonitor:
    def wait(self, cur_thread):
        # Put the waiter at the end of the notify queue
        self.monitor_lock.queue.append(cur_thread)
        # Thread releases lock and goes to sleep
        self.monitor_lock.sleep_and_release()

    def signal(self):
        # Move one thread into the ready state for the scheduler to wake up later
        ready_thread = self.monitor_lock.queue.pop()
        scheduler.append(ready_thread)

    def broadcast(self):
        # Call signal on all of the threads
        while not self.monitor_lock.queue.isEmpty():
            self.signal()
```

Whereas Hoare monitors require an extra queue (or some other marker) to identify waiting *signallers* from ordinary waiting threads:[^6]
```python
class HoareMonitor:
    def wait(self, cur_thread):
        # Put the waiter at the end of the notify queue
        self.monitor_lock.wait_queue.append(cur_thread)
        # Thread releases lock and goes to sleep
        self.monitor_lock.sleep_and_release()

    def signal(self, cur_thread):
        # Place the thread in a signal stack
        self.monitor_lock.signal_stack.append(cur_thread)
        # Give up lock and CPU to a waiter
        waiter_thread = self.monitor_lock.wait_queue.pop()
        self.monitor_lock.switch(cur_thread, waiter_thread)
        # If there's no waiter, we return to a thread on the signal stack
```

One of the biggest issues with Hoare monitors is that they allow for non-preemptive handoffs between threads, one of the things we specifically set out to avoid [here](#non-preemption)! This happens because the semantics of the waiter queue and the signal queue differ. In particular, the entry queue threads (where threads that want to use the monitor are placed -- different from the wait & signal queues) don't have the monitor lock, but the signal queue threads assume that they do have the lock. But in the case of the signal queue, the condition might not always be true -- we can't assume we have the lock!

## [Monitor procedures](#monitor-procedures)
There are three types of Mesa monitor procedures: entry, internal, and external.

Both entry and internal procedures are called with a monitor lock, but internal procedures are only called from *within monitor code*. Internal procedures are like private monitor methods which can break up repetitive or complicated routines within entry procedures.

External procedures are those which *don't require the monitor lock* but they do affect the monitor logically (some might argue that this isn't a good use of OOP principles).

The paper gives an example of a storage allocator (pg 7)[^1] with the methods `allocate`, `free`, and `expand`. `expand` doesn't require a monitor lock, but it relates to the data structure regardless, so it's an external procedure. `allocate` and `free`ing blocks require monitor locks and can be called from outside the monitor, so they're entry procedures.

If the storage allocator needed a function to, say, mark the blocks currently in use at different points in time and calculate the average use of each block, it would be an internal procedure (called only from within the monitor).

### Naked NOTIFY: Synchronization with I/O
How does Mesa handle devices, which can't exactly wait on a monitor lock (if they did, a speedy process could wait way too long for a slow process)?

Devices issue a NOTIFY to the condition variables so that the interrupt handler wakes (and processes the I/O). Since this NOTIFY occurs without a lock, it's termed a *naked* NOTIFY. Recall that we're using *shared memory* monitors, so we can find the condition variable at a fixed memory location.

There is, however, the possibility of a race: the thread sees the device is busy, is about to call WAIT, and then the device NOTIFYs the still-running thread. Since the process is aready awake, it completely misses the notify and the data is lost. The solution is to use a wakeup-wait switch.[^7]

## [Issues with Mesa](#issues-with-mesa)
### Priority Inversion
Consider the situation where a high-priority thread waits on a low-priority thread to produce a resource. To avoid the case where the low-priority thread in never scheduled (say there are other medium-priority threads ready), priority donation/inheritance is used. The low-priority thread inherits high-priority thread's priority until the resource is available (at which point it switches back to its original priority).

### Livelock
We know of deadlock, when processes are unable to make progress because they are blocked on each other. But what about livelock; when processes are able to change state and use the processor, but they still can't make any progress because of their entanglement?

This is mentioned on page 9 of the paper:[^1]
> A more serious problem arises if **M** calls **N**, and **N** then waits for a condition which can only occur when another process enters **N** through **M** and makes the condition true. In this situation, **N** will be unlocked, since the WAIT occurred there, but **M** will remain locked during the WAIT in **N**. This kind of two level data abstraction must be handled with some care. A straightforward solution using standard monitors is to break M into two parts: a monitor **M’** and an ordinary module **0** which implements the abstraction defined by **M**, and calls **M’** for access to the shared data. The call on **N** must be done from **0** rather than from within **M’**.

In this case, *N* isn't blocked, but it won't be able to make any progress. We're livelocked.

Livelock can be mitigated by using `broadcast` (which causes a dogpile of all of the newly awakened threads) or by setting a `timeout` parameter to the threads. The timeout dictates how long the thread can sleep, so it works like a staggered `broadcast`.

The paper outlines three recommended solutions if a process waiting in a monitor needs to resume (and it's taking too long to get control back):
1. **Timeout** using the timeout interval associated with the condition variable. Originally, the timeout raised an exception, but they decided that the "cost and complexity of handling the exception" wasn't worth the design (people were using it to retry processes, so it was an expected behavior). So timeouts don't cause exceptions.
2. **Abort** another process. The next time the "aborted" process `wait`s, it will resume and handle the abort exception (implemented via a state change in the queue). But the "aborted" process can actually just decide not to abort, so this is more of a nudge of "hey, you should terminate, I'm going to take a while" than anything.
3. **Broadcast** issues a NOTIFY to all of the waiting threads. Typically done if you need either all of the threads to try something (eg. multiple readers or maybe you need a specific thread to run but you don't know which one).

<details>
<summary>Also, trick question, can a single process deadlock with itself?</summary>
Yes, consider a recursive entry procedure (the example given in the paper)! Weird, right?
</details>

## [Conclusion](#conclusion)
Today, Hoare-style monitors are taught for program correctness and the mathematics of programming. Because they immediately give up the lock and CPU to the waiter, they give *strict guarantees for the state of the critical section*.

Mesa-style monitors are used by the POSIX library for the `pthread_cond_wait()`, `pthread_cond_signal()`, and `pthread_cond_broadcast()` functions.[^8] So Mesa monitors are used in actual operating systems today!

## [Sources & Notes](#sources--notes)
[^1]: The paper itself, *[Experience with Processes and Monitors in Mesa](https://people.eecs.berkeley.edu/~brewer/cs262/Mesa.pdf)*
[^2]: Wikipedia article on the [Xerox Star](https://en.wikipedia.org/wiki/Xerox_Star#Hardware)
[^3]: MIT [concurrency reading](http://web.mit.edu/6.005/www/fa14/classes/17-concurrency/) for the Software Construction class
[^4]: Admittedly, I don't think any critical section data would be modified by the page fault handler.
[^5]: Adapted from [Cornell notes](https://www.cs.cornell.edu/courses/cs4410/2018su/lectures/lec09-mesa-monitors.html) on Mesa-style monitors
[^6]: UC San Diego [graphs of monitor semantics](https://cseweb.ucsd.edu/classes/sp16/cse120-a/applications/ln/lecture9.html) and Wikipedia article on [monitors](https://en.wikipedia.org/wiki/Monitor_(synchronization)#Blocking_condition_variables)
[^7]: Check out [Robert Lee Rappaport's thesis paper](http://web.mit.edu/Saltzer/www/publications/TRs+TMs/Multics/TR-055.pdf), pages 33-34 of file (34-35 of the paper).
[^8]: See section "Condition Wait Semantics" of the Linux man page for [pthread_cond_wait(3) on die.net](https://linux.die.net/man/3/pthread_cond_wait). Since the invariants aren't guaranteed as soon as the condition wait returns, this implies that the POSIX mutex is a Mesa-style monitor.
