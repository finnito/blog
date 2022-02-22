---
title: "Custom Hugo Figure Snippet"
slug: "custom-hugo-figure-snippet"
date: 2020-04-11T10:12:19.296170+12:00
emoji: 💻
metaDescription: "Learn how to create a custom snippet to insert a responsive <figure> element into your Hugo posts!"
metaImage: "custom-figure-snippet-og-image.png"
prism: "true"
---

[Hugo][5] is a really nice way to write a blog - your writing is stored as plain text and by using [Markdown][1] you can introduce some nice basic HTML formatting. Markdown allows you to have HTML inside the same file by adding the following flag to your `config.toml` file:

```toml
[markup.goldmark.renderer]
    unsafe=true
```

<!--more-->

However, if you want to use Hugo's functions inside HTML which is inside your Markdown file, that is not allowed. Enter, Hugo snippets  !
In your theme (mine is called `hugo-finn`) create the directory `layouts/shortcodes/` and inside this directory create a snippet file (mine is called `figure.html`).

These snippet files are special because any Hugo functions inside the snippet are parsed, before the snippet itself is parsed into the Markdown file. [Read the full shortcode documentation here][2].

Here is how I call my snippet, where `src`, `title`, and `author` are the arguments passed to the `figure.html` snippet.

```
{{</* figure name="" title="" author="" */>}}
```

And, here is how the snippet works, where the main takeaway is `{{ .Get "src" }}` is how to get an argument input!

```
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

Pretty sweet! I've even got `:figure` mapped as a text expansion shortcut so I don't have to remember the syntax each time! Click through to read about [responsively serving images with srcset][3], or click through to read about [my image resizing service, AutoImageResizer][4], head over here!

Happy developing!

-- Finn 👋

## References
- [Daring Fireball: Markdown][1]
- [GoHugo: Shortcodes][2]
- [Finn LeSueur: Figure, Srcset & Lazy Loading][3]
- [Finn LeSueur: AutoImageResizer][4]
- [GoHugo][5]

[1]: https://daringfireball.net/projects/markdown/syntax "Daring Fireball: Markdown"
[2]: https://gohugo.io/content-management/shortcodes/ "GoHugo: Shortcodes"
[3]: https://finn.lesueur.nz/posts/lazy-loading/ "Finn LeSueur: Figure, Srcset & Lazy Loading"
[4]: https://finn.lesueur.nz/posts/auto-image-resizer/ "Finn LeSueur: AutoImageResizer"
[5]: https://gohugo.io/ "GoHugo"
