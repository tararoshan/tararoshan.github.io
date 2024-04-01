---
title: Semaphores, monitors, and synchronization, oh my!
layout: post
category: OperatingSystems
lastUpdated:
---

## Table of contents


First, a quick recap of our synchronization primatives! Recall that for multithreaded processes, operations which either completely take place or don't are *atomic*. In order to have atomicity 

- critical sections (define, why we need to guard them)
- what's a semaphore
- what's a lock (binary semaphore)
- what's a condition variable
- message passing
- shared memory
- tradeoffs of message passing v. shared memory
