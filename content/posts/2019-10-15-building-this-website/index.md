---
title: "Building This Website"
date: "2019-10-15T19:38:06+13:00"
slug: "building-this-website"
categories: ["Development"]
metaDescription: "How this website gets built using Hugo, CI and how I keep it running smoothly."
---

The more I use the internet, the more opinionated I have become with regards to a few things.

1. Speed
2. Size
3. Javascript
4. Plain Text

Let's go one at a time!

## 1. Speed

Like most people, I use the internet on my phone _a lot_. Speed matters. No one wants to wait for website to load; to have it jump around as different chunks of content load; or to have it take multiple seconds to become interactive.

For this reason I have gone backwards and returned to the world of static web pages. The tool I am using for this is [Hugo](https://gohugo.io/). It creates static HTML web pages from [Markdown](https://daringfireball.net/projects/markdown/) and HTML template files. It is wonderfully performant and easy to use.

No more server-side rendering for each request, and no more heavy JS or PHP frameworks. Just simple markdown and some basic templating.

## 2. Size

This ties into my first point: _speed_. Actually, all my points tie together. The smaller the assets, the quicker it loads. Thanks to the world of HTTP/2 and QUIC, smaller, split-up assets lead to a very, _very_ quick loading experience.

Currently my average page weight is:

- ~3-10kb of HTML
- 1.52kb of CSS
- 3.19kb favicon

Unfortunately, there is only so much I can do to lower the __time to first byte__ (TTFB) due to my server location. This has to do with the time taken for signals to travel down wires and through networks.

I am located in New Zealand, but no local hosts can compete with [Linode](https://www.linode.com/) for server performance or cost. So, I choose to suffer a slower TTFB from all the way over here in New Zealand for cheaper and better hosting experience.

## 3. Javascript

I just don't like it, if I'm honest. The frameworks tend to be large, and we've already talked about how much I love a small payload. Javascript is a huge performance hit for any browser and people use it badly. For these reasons and more, I generally avoid it where at all possible. Enough said.

## 4. Plain Text

Like many people on the internet, I am a little afraid to having my content tied up in proprietary formats which may break, be discontinued or that rely on paid software. Plain text is none of these things. It can be stored and diffed in [Git](https://git-scm.com/); it can be read in many editors; it is universally supported; and it is easy to read.

Granted, Hugo uses a mixture of plain text and Markdown which is a slight augmentation of plain text. But:

> The overriding design goal for Markdown’s formatting syntax is to make it as readable as possible. The idea is that a Markdown-formatted document should be publishable as-is, as plain text, without looking like it’s been marked up with tags or formatting instructions. - [John Gruber, author of Markdown](https://daringfireball.net/projects/markdown/)

## Complexities

In order to live this simpler life, I had to figure out how to initially deploy the website and create a nice continuous integration pipeline so that my updates flow easily.

When I commit to my repository, a Gitlab pipeline is triggered using this `.gitlab-ci.yml` script.

```
stages:
  - deploy

variables:
  GIT_SUBMODULE_STRATEGY: recursive

deploy:
  stage: deploy
  before_script:
  - apt-get update -qq
  - apt-get install -qq git
  - 'which ssh-agent || ( apt-get install -qq openssh-client )'
  - eval $(ssh-agent -s)
  - ssh-add <(echo "$SSH_PRIVATE_KEY")
  - mkdir -p ~/.ssh
  - '[[ -f /.dockerenv ]] && echo -e "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config'
  script:
    - ssh finn@my.private.hidden.ip "cd /srv/finn.lesueur.nz/ && git checkout master && git pull origin master --recurse-submodules && exit"
    - ssh finn@my.private.hidden.ip "cd /srv/finn.lesueur.nz/ && rm -rf public/"
    - ssh finn@my.private.hidden.ip "cd /srv/finn.lesueur.nz/ && hugo && exit"
  only:
    - master
  artifacts:
    paths:
    - public
```

In essence this script says:

1. Connect to the server & get the latest commits from Git,
2. remove the public directory to avoid stale content getting left behind,
3. get Hugo to generate the latest site content.

Not too complex, but also not completely simple. I do love it though.
