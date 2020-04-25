---
title: "Auto Image Resizer"
date: 2020-04-25T14:59:10+12:00
categories: ["Development"]
metaDescription: "A tiny Lumen application to resize images on the fly to help serve responsive images in srcsets."
metaImageURL: "/projects/auto-image-resizer/auto-image-resizer-project-og-image.jpeg"
---

__[Source Code: Gitlab][gitlab]__

## What was the Problem?

I am always looking for ways to speed up and reduce the payload size of my website pages, and images are essentially always use the most data on a webpage. So, how to reduce that?

1. __Lazy load__ - don't load images unless the user has reached the part of the page with the image, this means images won't be loaded unnecessarily,
2. __resize and minify__ - don't upload an image straight from your DSLR camera that is >4000px across and 21mb in size. Resize it to the maximum size it would probably be displayed at (?1920px) and use a compressor to reduce its footprint.

We can do a combination of these by using the `loading="lazy"` attribute on `<img/>` elements and `srcset` to serve images with different sizes depending on the size of the screen opening the website!

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

This is a great improvement, but what if I don't want to pre-decide what image dimensions I want, what if I want to just upload a large(ish) image and have it resized on the fly? Enter: __Auto Image Resizer__.

## The Solution

I wrote a tiny [Lumen][lumen] application that takes an image through a URL, stores it, resizes it as needed and serves it back! This is great because it allows me to simply upload a single image and get whatever sizes I need from that one image. Auto Image Resizer has one API endpoint and it looks like this:

```
https://img.lesueur.nz/1024?u=https://finn.lesueur.nz/posts/ipad-part-one/terminus-working-copy.png
```

You can learn how I integrated this into a [Hugo][gohugo] snippet so that I could render a `<figure>` element like above with a single line inside my Markdown [over here][hugosnippets]. Implementing this has saved me a lot of time and effort and makes me feel confident that I am not wasting the bandwidth or time of my users when they come to my site.

### Learnings

- Lumen is great, it is like Laravel but faster. The way it makes itself faster is by doing very little out of the box and letting your turn things on yourself. It took some figuring to understand how it all works and do stuff like including another package ([Intervention/Image][intervention]) but I'm a big fan.
- When I first put it up I noticed that it wasn't sending the appropriate headers for the images to be cached on the client side - I was checking my `apache.conf`, my `.htaccess` but it turns out the simplest way to do this was to just add an array of `$headers` to the `->response()` function. Who'd have thought?

### Getting Started

If you are interested in setting up AutoImageResizer for your website, head over to [the Gitlab page][gitlab] and follow the instructions to get it set up on your website!

File an issue if it doesn't work or send me an email if you get real stuck!

-- Finn 👋

[gitlab]: https://gitlab.com/Finnito/AutoImageResizer "AutoImageResizer on Gitlab"
[lumen]: https://lumen.laravel.com/ "Laravel's Lumen"
[gohugo]: https://gohugo.io/ "Hugo - Static Site Generator"
[hugosnippets]: https://finn.lesueur.nz/posts/custom-hugo-figure-snippet/ "Hugo figure snippet by Finn LeSueur"
[intervention]: http://image.intervention.io/ "Intervention's Image"