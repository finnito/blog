---
title: "PyroCMS 3 & Laravel: setLocale Compatability Error"
slug: "set-locale-error"
date: 2020-02-28T12:01:20.805810+13:00
emoji: 💻
metaDescription: "How to fix 'setLocale($locale) must be compatible with setLocale(string $locale)' in PyroCMS and Laravel"
metaImage: "setLocale-og-image.png"
prism: "true"
expiryDate: 2024-11-11
---

## The Problem

For the longest time I did the dance of setting up Apache, PHP-FPM and managing PHP versions on my Macbook Pro for website development using the PyroCMS 3 framework, but last week I got hit with this error when trying to create a new project:

```php
Declaration of Symfony\Component\Translation\TranslatorInterface::setLocale($locale) must be compatible with Symfony\Contracts\Translation\LocaleAwareInterface::setLocale(string $locale)

<!--more-->

```
## Solution #1: Change Your PHP CLI Version

After some Googling I found this answer: 

> "It looks like you ran composer update with a different PHP version than the one that is used to execute the application (see also #34482)." - [xabbuh on GitHub][github]

I battled with PHP Brew and tried to change my PHP CLI version, but it got very messy and I gave up, if I'm honest!

Time to try something else.

## Solution #2: Laravel's Valet

[Valet][valet] is a really wonderful tool that sends all `.test` domains to localhost and matches them to to any folder(s) you set up, and it remarkably painless to use!

Because I'm on MacOS:

```bash
brew update
brew install php
# At this point I already have Composer installed
composer global require laravel/valet
valet install
cd ~/Websites/cyc
valet park
```

And now I can go to `cyc.test` on my local machine and I am good to go, and there is no PHP error due to a mismatch between the CLI and Apache versions.

I am very happy to have found Valet! Good luck and happy developing to you all! 💻

## References
- PyroCMS 3: https://pyrocms.com/
- Valet: https://laravel.com/docs/6.x/valet
- GitHub Solution: https://github.com/symfony/symfony/issues/34506#issuecomment-557481458

[pyro-3]: https://pyrocms.com/
[valet]: https://laravel.com/docs/6.x/valet
[github]: https://github.com/symfony/symfony/issues/34506#issuecomment-557481458
