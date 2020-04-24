---
title: "LinkChecker - Detect Link Rot on Your Website"
date: 2020-03-02T23:14:41.716005+13:00
categories: ["Development"]
metaDescription: "My little Python script to detect link rot on websites through checking of HTTP status codes. Lightweight and useful!"
metaImageURL: "/projects/link-checker/link-checker-project-og-image.png"
---

__[Source Code: Gitlab][gitlab]__

## What was the Problem?

I first encountered the idea of avoiding link rot while reading an answer on [StackOverflow][linkrot] - someone was asked to provide code directly in their answer instead of just linking to an external website. The reason given for this was that if the external website was to go down then their answer would become less useful (or even useless).

I think about this a lot when I work on my website - if I am going to provide a link to an external resource, I want to be sure that it is accessible.

## The Solution

With that in mind, I wrote a little (122 lines) Python script that does a few things:

1. Takes in an XML sitemap
2. Opens every URL in that sitemap
3. Opens every `<a>` element on every page
4. Keeps track of the [HTTP status code][httpcodes] of every anchor
5. Makes a little report detailing every page with a list of broken links (anything in the `4xx` and `5xx` range).

To my delight it was immediately useful - pointing out 3 links that had been dead for who knows how long!

### Learnings

- The last thing I had written in Python used [virtualenv][virtualenv] but I had been reading that [pipenv][pipenv] was now recommended. It was actually harder to figure out how to deploy using pipenv and fight with multiple Python versions. I got there, though, and it seems to work from what I can tell. It seems to resemble using [Composer][composer] with PHP, interestingly enough.
- It's usually pretty easy to hit up a Python script to run regularly with [crontab] but was harder with pipenv and it took some figuring but I got there!
- Sending reliable email is rubbish so I didn't implement it but left it up to `sendmail` to do the job if the user has it set up properly. Ugh.

### Getting Started

If you are interested in having a lightweight script scrape your website on demand or on a regular basis to check all your links for link rot, head over to [the Gitlab page][gitlab] and follow the instructions to get it set up on your website!

File an issue if it doesn't work or send me an email if you get real stuck!

-- Finn 👋

[gitlab]: https://gitlab.com/Finnito/link-checker "LinkChecker on Gitlab"
[linkrot]: https://stackoverflow.com/a/47789666 "Link rot example on StackOverflow"
[httpcodes]: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes "HTTP Status Codes on Wikipedia"
[virtualenv]: https://virtualenv.pypa.io/en/stable/ "Python's Virtualenv"
[pipenv]: https://pipenv.pypa.io/en/latest/ "Python's pipenv"
[composer]: https://getcomposer.org/ "PHP's Composer"
[crontab]: https://www.adminschoice.com/crontab-quick-reference "Crontab"