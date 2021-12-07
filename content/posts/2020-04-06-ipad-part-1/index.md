---
title: "iPad Part One"
slug: "ipad-part-one"
date: 2020-04-10T17:02:48+12:00
categories: ["iPad", "Development"]
metaDescription: "How I’m being productive on a 2020 iPad Pro 12.9 - Git, SSH, VPN and Remote Desktop."
metaImageURL: "/posts/ipad-part-one/terminus-working-copy.png"
prism: "true"
---

This post is coming to you from a 2020 iPad Pro 12.9" - a beautiful, huge, iPad. Back in 2010 I owned a iPad 1 (thanks Dad!) - I ostenstably used it for schoolwork, but I think I mostly played the tower defence game, [Sentinel 3][1], while pretending to do work in my Statistics class.

{{< figure name="sentinel-screenshot" title="Sentinel 3" author="Finn Le Sueur" >}}

<!--more-->

Fast forward a decade and I have finally upgraded! Unlike 16 year old me, I would like to make a good attempt and being productive with it. And also very unlike 16 old me, I am now a Science and Physics teacher at that very high school I sought to avoid work in. So, how can I be productive on this device?

## This Blog & Teaching Notes

I have previously written about [how I built this website][2], but all of that was done on my Macbook Pro. How could I do it on my iPad? I need a good Git client and possibly a SSH client, too (for debugging when things break!). I also write all my teaching notes in Markdown and use Pandoc to convert them to HTML slides - so Git is going to be very important.

### Git with [Working Copy][3]

Working Copy is a truly excellent git client written by Anders Borum. I bought it back when it was much cheaper, but if you are planning on doing actual work on your iPad then $34.99 is surely worth every cent. I could not recommend it enough. I have all my important repos cloned onto it so I can write, make bug fixes and even deploy!

### SSH with [Terminus][4]

Terminus is another truly great app. I managed to set up SSH to my server with public key authentication which was pretty cool! Now I can SSH into my Linode instances in case I want to do some work in there or kickstart a dead process. 

{{< figure name="terminus-working-copy" title="Working Copy & Terminus" author="Finn Le Sueur" >}}

## Physics Tutorials with [Concepts][6]

As of writing this post, New Zealand is on day 15 of [Level 4 lockdown][5] due to Covid-19. This means that everything except essential businesses are closed, including education centres. As a Physics high school teacher this is significant because now I have to teach from home! I thought about setting up a camera and writing on paper to do equations and working, buuut I had my eye on an iPad.

Enter, Concepts & iOS Screen Recording! I use the free version of Concepts, simply importing images of the questions that I am working on before using my Apple Pencil and the built in iOS screen recording tool to record my screen and microphone. 

<iframe loading="lazy" width="560" height="315" src="https://www.youtube.com/embed/WejOMmeZhyM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## VPN & Remote Desktop

The school I work for, while reasonably tech forward, is very much a Windows-first and MacOS if-it-works kind of place. Because I really like my MacBook Pro I have been using it instead of my work issued laptop so far - the only major issue is that the software that is used to take the roll, do reporting and other administrative tasks is only available on the school laptops or via Remote Desktop. Enter, [Microsoft Remote Desktop][7] - a solid, free and workable app. Does the trick on my MacBook, and thankfully, also here on my iPad.

This will work perfectly by itself when I am connected to the school wifi network, but less so when I am elsewhere. Enter, corporate the VPN (yuck). The app designated for use by the school is [FortiClientVPN][8] which seems to do the trick - although the MacOS app is a hard to use, hot mess but that is a story for another time.

With these two apps in tow I can happily Remote Desktop into work and do all my usual tasks there. I even tested it out by doing some reporting while on holiday break!

All in all, pretty successful and I can seem to get most of my work done here so far!

—- Finn 👋

### References
- [Sentinel 3: iOS App Store][1]
- [Building this Website][2]
- [Working Copy: iOS App Store][3]
- [Terminus: iOS App Store][4]
- [New Zealand Pandemic Alert Levels][5]
- [Concepts: iOS App Store][6]
- [Microsoft Remote Desktop: iOS App Store][7]
- [ForticlientVPN: iOS App Store][8]

[1]: https://apps.apple.com/nz/app/sentinel-3-homeworld/id415917116?mt=12 "Sentinel 3 on the iOS App Store"
[2]: https://finn.lesueur.nz/posts/building-this-website/ "Building This Website"
[3]: https://apps.apple.com/nz/app/working-copy-git-client/id896694807 "Working Copy on the iOS App Store"
[4]: https://apps.apple.com/nz/app/termius-ssh-client/id549039908 "Terminus on the iOS App Store"
[5]: https://covid19.govt.nz/alert-system/covid-19-alert-system/ "New Zealand Pandemic Alert Levels"
[6]: https://apps.apple.com/nz/app/concepts/id560586497 "Concepts on the iOS App Store"
[7]: https://apps.apple.com/nz/app/microsoft-remote-desktop/id714464092 "Microsoft Remote Desktop on the iOS App Store"
[8]: https://apps.apple.com/nz/app/forticlient-vpn/id1475674905 "FortiClientVPN on the iOS App Store"