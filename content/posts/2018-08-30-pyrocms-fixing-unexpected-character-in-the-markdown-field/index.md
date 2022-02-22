---
title: "Fixing Unexpected character & in the PyroCMS 3 Markdown Field"
date: 2018-08-30T14:03:56+13:00
slug: "pyrocms-fixing-unexpected-character-in-the-markdown-field"
emoji: 💻
metaDescription: "Getting Unexpected character '&' when parsing Twig in the PyroCMS 3 Markdown Field? Make sure you use single quotes instead of double quotes in the plugin! "
metaImage: "PyroCMS-Addons.png"
prism: "true"
---

Something I have recently gotten into is writing in [Markdown][md] - in fact, these very posts in my Guides addon are written in [Markdown][md]. It is very readable and great for publishing, but sometimes you want to go further and embed some more complex HTML elements inside it. Markdown natively allows you to do that, but I wanted to supercharge this so I got [Twig][tw] involved!

## The Error

```
Symfony \ Component \ Debug \ Exception \ FatalErrorException (E_UNKNOWN)
Method Illuminate\View\View::__toString() must not throw an exception, caught ErrorException: Unexpected character "&".
```

I ran into this error after I wrote a [custom Twig plugin][twcp] to get an image from its slug, and output a custom bit of HTML for lazy loading and prettier display ([Thanks to PyroCMS 3 it is very easy to make a custom Twig plugin!][pyroplugin]).

The error occured when I rendered the [Markdown field in PyroCMS 3][mdf] like this:

```html
<div>{{ guide.content.parse()|markdown|raw }}</div>
```

## The Solution
**You should use single quotes instead of double quotes in your Twig plugins inside the [PyroCMS Markdown Field][mdf]!**

I discovered this after trying numerous things including escaping, raw output, HTML filters and more, so there you go!

```twig
// Do This
{{ guide_image('your-image.jpg')|raw }}

// Don’t Do This
{{ guide_image("your-image.jpg")|raw }}
```

This fixed it for me and I have not had any problems since!

## References
* __Markdown__: <https://daringfireball.net/projects/markdown/>
* __Twig__: <http://twig.symfony.com>
* __Custom Twig Plugins__: <https://symfony.com/doc/current/templating/twig_extension.html>
* __PyroCMS Markdown Field Type__: <https://pyrocms.com/documentation/markdown-field-type>
* __Pyro Custom Plugin__: <https://pyrocms.com/help/addon-development/plugins/creating-a-plugin>

[md]: https://daringfireball.net/projects/markdown/
[tw]: http://twig.symfony.com
[twcp]: https://symfony.com/doc/current/templating/twig_extension.html
[mdf]: https://pyrocms.com/documentation/markdown-field-type
[pyroplugin]: https://pyrocms.com/help/addon-development/plugins/creating-a-plugin