---
title: "Figure, Srcset and Lazy Loading"
slug: "lazy-loading"
date: 2020-04-10T19:01:47+12:00
expiryDate: 2021-12-31
emoji: 💻
metaDescription: "Learn about the new loading='lazy' attribute and how to use <figure> and <img> srcsets!"
metaImage: "figure-html-screenshot.png"
prism: "true"
---

## Lazy Loading

There is a new, although [not particularly well supported][1] attribute for `<iframe>` and `<img/>` tags: `loading="lazy/eager/auto"`. This is _huge_ because it allows the browser to determine when an image or iframe should be loaded as the user proceeds through a webpage instead of just loading them all at the start! No more JS to improve data use and performance - just a sweet native progressive enhancement.

<!--more-->

A __progressive enhancement__, for those unaware, is one that only applies to browsers that have it implemented. It also means that older browsers that have not implemented it are not impacted because there is no change to the important parts of the markup. To add lazy loading to images or iframes simple do the following (note how the important parts are unchanged):

```html
<img loading="lazy" alt="My Image" src="/path/to/my/image.png"/>

<iframe loading="lazy" width="560" height="315" src="https://www.youtube.com/embed/WejOMmeZhyM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
```

## Figure & Srcset

I like to use the `<figure>` element to display images inside my posts, and have recently (yesterday) converted to using the `srcset` attribute in `<img/>` elements to responsively serve differently sized images depending on the size of the screen. Note the use of `loading="lazy"` in the `<img/>` element:

```html
{{ $img := (index (.Page.Resources.Match (print (.Get "name") ".*")) 0) }}
{{ $img512 := (index (.Page.Resources.Match (print (.Get "name") "-512.webp")) 0) }}
{{ $img1024 := (index (.Page.Resources.Match (print (.Get "name") "-1024.webp")) 0) }}
{{ $img2048 := (index (.Page.Resources.Match (print (.Get "name") "-2048.webp")) 0) }}
<figure>
    <a href='{{ $img.Permalink }}' title='Full size image: {{ .Get "title" }}'>
        <img 
            srcset='
                {{ $img512.Permalink }} {{ $img512.Width }}w,
                {{ $img1024.Permalink }} {{ $img1024.Width }}w,
                {{ $img2048.Permalink }} {{ $img2048.Width }}w'
            sizes="(min-width: 780px) 584px, calc(100vw - 16px)"
            height="{{ $img.Height }}"
            width="{{ $img.Width }}"
            src='{{ $img.Permalink }}'
            alt='{{ .Get "title" }}'
            loading="lazy"/>
    </a>
    <figcaption>(📷: {{ .Get "author" }}) {{ .Get "title" }}</figcaption>
</figure>
```

The second argument for each URL is the width of the image - this allows the browser to know the actual pixel width and do calculations in the background including screen width and pixel density to determine what size image is most appropriate. Very cool!

Good luck getting stuck into serving images that are appropriately sized for different screens and helping your users save both time and bandwidth!

-- Finn 👋

## References
- [CanIUse: Lazy Loading Attribute][1]

[1]: https://caniuse.com/#feat=loading-lazy-attr "CanIUse: Lazy Loading Attribute"
