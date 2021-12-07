---
title: "🌅 AutoImageResizer"
slug: "auto-image-resizer"
date: 2020-04-11T09:44:24+12:00
draft: true
categories: ["Development", "Project"]
metaDescription: "Introducing, AutoImageResizer! A tiny Lumen application that takes images via an API, resizes them and serves them back to the user for responsive image display!"
metaImageURL: "/posts/auto-image-resizer/auto-image-resizer-og-image.png"
prism: "true"
---

Introducing, [AutoImageResizer][1]! A tiny Lumen application that takes images via an API, resizes them and serves them back to the user for responsive image display!

<!--more-->

## The Problem

This is a single-evening project that I whipped up to solve a very specific problem: _how can I responsively size and serve images to my users to save both bandwidth and time?_

Because I am comfortable using PHP and my server stack makes it very easy to deploy PHP applications, I decided to make a [Lumen][2] application. For those not in the know, Lumen is a "stunningly fast micro-framework by Laravel" - that is to say, it is a stripped down and speedy version of Laravel. Perfect. You enable only what you need, disable the rest and enjoy the blazingly fast speeds.

Anyway, let's get back to the problem: resizing and serving images! As I mentioned in my post yesterday ([Figure, Srcset & Lazy Loading][3]), I use a `<figure>` element to display my images:

```html
<figure>
    <img 
        srcset='
            https://finn.lesueur.nz/my-image-4096.png 4096w,
            https://finn.lesueur.nz/my-image-2048.png 2048w,
            https://finn.lesueur.nz/my-image-1024.png 1024w,
            https://finn.lesueur.nz/my-image-512.png 512w'
        src='https://finn.lesueur.nz/my-image.png'
        alt='This is my cool image!'
        loading="lazy"/>
    <figcaption>(📷: Finn LeSueur) This is my cool image!</figcaption>
</figure>
```

## The Solution

This is an excellent start to serving responsive images, but _I don't want to decide ahead of time and resize all my images_, so how can I avoid this? What if I pass the URL for the full sized image to a service that will resize it on the fly? Sounds like a winner to me. I won't dig into how I did it ([go read the code if you want to see][4]), but the server ends up with a directory that looks like this:

{{< figure src="/posts/auto-image-resizer/auto-image-resizer-storage-screenshot.png" title="AutoImageResizer storage screenshot" author="Finn LeSueur" >}}

It creates and stores the images that it resizes so that it can serve them back to the user at maximum speed next time. Pretty neat. It also stores images in folders by the hostname of the server they are coming from - it does this to try avoid image name conflicts. This is important because it does not use a database to store image references, it simply uses filenames. Obviously this leaves a lot of room for problems, but I wanted something fast, simple and that would work for my use-case. Perhaps I'll do something more robust in the future!

Let's bring it together and see how I can use this with my `<figure>` snippet from above:

```html
<img
    srcset="
        https://img.lesueur.nz/full?u=https://finn.lesueur.nz/posts/ipad-part-one/terminus-working-copy.png 4096w,
        https://img.lesueur.nz/2048?u=https://finn.lesueur.nz/posts/ipad-part-one/terminus-working-copy.png 2048w,
        https://img.lesueur.nz/1024?u=https://finn.lesueur.nz/posts/ipad-part-one/terminus-working-copy.png 1024w,
        https://img.lesueur.nz/512?u=https://finn.lesueur.nz/posts/ipad-part-one/terminus-working-copy.png 512w," 
    src="https://finn.lesueur.nz/posts/ipad-part-one/terminus-working-copy.png"
    alt="Working Copy &amp; Terminus"
    loading="lazy">
```

As you can see, I have my application hosted at __img.lesueur.nz__ and it has a single endpoint that takes a width constraint and a single query parameter which contains the URL to the full image!

Also, to avoid abuse I added a `.env` parameter that allows you to restrict what hosts can provide images to the application so that only you can provide images. A pretty small check, but one with a big impact.

```
URL_CONSTRAINT=finn.lesueur.nz #Can comma separate multiple hosts
```

Overall, I am extremely happy with this little service. Perhaps one day I'll build on it to make something a bit more robust, but for now, this'll work nicely.

-- Finn 👋

## References
- [Gitlab: AutoImageResizer][1]
- [Laravel's Lumen][2]
- [Finn LeSueur: Figure, Srcset & Lazy Loading][3]

[1]: https://gitlab.com/Finnito/AutoImageResizer "Gitlab: AutoImageResizer"
[2]: https://lumen.laravel.com/ "Laravel's Lumen"
[3]: https://finn.lesueur.nz/posts/lazy-loading/ "Finn LeSueur: Figure, Srcset & Lazy Loading"
[4]: https://gitlab.com/Finnito/AutoImageResizer/-/blob/master/routes/web.php "AutoImageResizer Code"
