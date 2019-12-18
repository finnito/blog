---
title: "PyroCMS 3: Creating Themes"
date: 2019-12-18T10:03:51+13:00
categories: ["Development", "PyroCMS"]
metaDescription: The start of a journey in learning how to create and work with themes in PyroCMS 3. Using artisan, composer and some PyroCMS multisite tips.
metaImageURL: "2018-05-26-PyroCMS-Creating-Themes.png"
---

The start of my journey with [PryoCMS 3][pyro-3] was learning how to make custom themes. I originally learned how to develop with [PyroCMS 2.2][pyro-2] where I did not need to use the command line to create themes; it was entirely file-based. [PyroCMS 3][pyro-3] was entirely different!

## PHP's [Artisan][artisan]
Theme creation is done using [Artisan][artisan] in the command line. Ensure you are in your base [PryoCMS 3][pyro-3] directory where a file called `artisan` should be visible.

Here is the base command:

```bash
php artisan
```
If you have a single-site installation of [PryoCMS 3][pyro-3] then you can use the command:

```bash
php artisan make:addon {vendor}.theme.{slug}
```
and if you are using the [Sites Module][sites-module] and want to create a theme for a particular site, the command looks like this:

```bash
php artisan make:addon {vendor}.theme.{slug} --app={reference}
```

Now, let's break down the placeholders I have left in these commands.

* `{vendor}`: Typically your Github username. E.g. `finnito` for me.
* `{slug}`: Slug representing the theme name. E.g. `test`.
* `{reference}`: Slug of the site in the [Sites Module][sites-module]. E.g. `finnito`.

If you need to find your site slug, navigate to `/admin/sites` and each entry should have a unique reference. You **do not** need to encase any of the variables in quote marks.

### Putting it Together
Putting this together, to create a theme with slug `test` for a site with reference `finnito` using my vendor slug `finnito` we have:

```bash
php artisan make:addon finnito.theme.test --app=finnito
```

### Debugging
If you get an error that looks something like this:

```php
In Container.php line 752:  
  Class Finnito\FinnitoTheme\FinnitoTheme does not exist
```

you will need to run the following command:

```bash
composer dump-autoload
```
This gets [Composer][composer] to optimise its autoload files and will fix this error.

## Installing Themes
You can now install the theme by navigating to `/admin/settings` and setting the theme.

It was quite a journey for me to learn how to make a theme in [PryoCMS 3][pyro-3] using [Artisan][artisan]. I was originally trying to create individual files and to replicate the file structure of a test theme, and this was a disaster. Now that I have internalised the usage of [Artisan][artisan] and [Composer][composer] for this, it is very simple and speedy!

[pyro-3]: https://pyrocms.com/
[pyro-2]: https://github.com/pyrocms/pyrocms/tree/2.2/master
[artisan]: https://pyrocms.com/help/developer-tools/cheatsheets/artisan-commands
[sites-module]: http://store.pyrocms.com/sites-module.html
[composer]: https://getcomposer.org/doc/01-basic-usage.md

## References
- PryoCMS 3: <https://pyrocms.com/>
- PyroCMS 2: <https://github.com/pyrocms/pyrocms/tree/2.2/master>
- Artisan: <https://pyrocms.com/help/developer-tools/cheatsheets/artisan-commands>
- Composer: <https://getcomposer.org/doc/01-basic-usage.md>
- PyroCMS 3 Sites Module: <http://store.pyrocms.com/sites-module.html>
