---
title: Cat the Quest CTF
layout: post
category: cybersecurity
lastUpdated:
---

Last week, I participated in the [Cat the Quest CTF](catthequest.com), a French-based international
Capture the Flag tournament. It was their first year hosting. I found them on [CTF time](ctftime.org)
and made it a point to go. CTFs seem like they'd be a lot of fun if I actually knew what I was
doing, so I *would* like to improve.

I solved three of the 27 or so problems successfully, but I do think the translations for the
English challenges were confusing.[^1] Overall, I loved the CTF: the hosts were very polite and the
other registrants were very funny in the Discord server. It was a nice community.

With that being said, here's a log of two of the problems I solved plus one that I almost did.

# HAM
**Radio**

This was the first time I saw a radio challenge at a CTF! We were given the call sign of the radio
(GB150GM) and tasked to "find the following information about the issuer of this callsign: First
Name Last Name City GPS Coordinates."

So I DuckDuckGo'd "ham radio callsign GB150GM" and found the name Steven Holland associated,
according to [hamcall.net](https://www.hamcall.net/call?callsign=GB150GM). I found the neighborhood
as well, but no GPS coordinates. After searching around a bit more, I found the coordinates on
[qrzcq.com](https://www.qrzcq.com/call/GB150GM): 50.2291667, -5.2083333.

CAT{STEVEN_HOLLAND_REDRUTH_50.2291667-5.2083333}

This challenge was pretty funny because the callsign was associated with the anniversary of an
Italian guy whose name looked like macaroni. It was so bizarre and yet cute.

# Atlantis
**Steganography + OSINT**

Given a text file *something* like the one below, competitors were later told to "use the numbers
and coordinate system given in the description" to find the flag. Also, the flag was in French (but
no accents). So, for example, if the locatioon was the Black Sea, the flag would be CAT{mer-noir}.
 > Posted by: verite87@gmail.com<br>
 > Likes: 254<br>
 > Last updated: 98 minutes ago<br>
 > Across these 7 continents, we are all connected by a global system. It is almost as odd as the
 > existence of this island, I know, but it is true. From anywhere, we can understand the location
 > because of the precision of this univeral refer3nce system.

Interesting to note, the French version had the 3 in the word "univers3l," so it was clear the
numbers really meant something. The organizers later announced that the numbers were 87 254 98 73.
My first thought was to run `nc 87.254.98.73`, but the connection timed out.

So I searched up "GPS four coordinates" (after all, how did I know to chose NE, NW, SE, or SW?). No
luck. In a moment of desperation, I put the numbers into Google Maps. Lo and behold, the Arctic
Ocean.

CAT{ocean-arctique}

# Ave Caesar
**Programming**

This was my favorite of the five or so problems I attempted for the CTF! Given a container's IP and
port, we were told to hold a conversation with it. The initial response from `nc IP PORT` was
> Oh uhvwh gx fkdoohqjh jdughud ohv phphv sdudphwuhv

After running through a brute force ROT cipher, the response which seemed the most plausible was
"Le reste du challenge gardera les memes parametres." In English, "The rest of the challenge will
keep the same parameters." HAHA international CTFs are so fun...!

So I made a expect script to send over my response[^2] and got the next messsge which, rotated by
the same amount (+3), was
> AntiBreaker-BuM\|sUwDBHuFjpqZ3SfOSY\|JTY2-BreakerAnti

But sending back this rotated message was of no use. After reading through a writeup, it turns out I
was supposed to send back just the part between the pipes[^3] and keep doing that over and over
again.

Even though I didn't capture this flag, it was still my favorite challenge!

[^1]: In particular, there was one about a Flipper Zero named "fpopo" where we had to search through USGS archives. I found all the items in the flag, but I thought they seemed so irrelevant to each other that there was *no way* that *that* was the flag.
[^2]: The challenge required some form of automation/programming or else the connection would time out. Hence its classification as a programming challenge.
[^3]: The description did say something about unnecessary information to disregard, but I was confused. To be honest, I can't tell if they were trying to be cryptic or if the English translations were intentionally that confusing. Either way, it made for a fun CTF.
