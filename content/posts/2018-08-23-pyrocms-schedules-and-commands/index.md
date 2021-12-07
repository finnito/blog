---
title: "PyroCMS 3: Schedules & Commands"
date: 2018-08-23T13:57:07+13:00
slug: "pyrocms-schedules-and-commands"
categories: ["Development", "PyroCMS"]
metaDescription: "In the past, you might have written a cron job to execute a periodic command to help run your website backend. With PyroCMS these days are behind you with the aid of custom Artisan commands and Laravel scheduling!"
metaImageURL: "PyroCMS-Addons.png"
prism: "true"
---

In the past, you might have written a cron job to execute a periodic command to help run your website backend. With [PyroCMS][pyro] these days are behind you with the aid of custom [Artisan commands][Artisan] and [Laravel scheduling][laravels]!

## Step 1: Make the Artisan Command
The first thing we need to do is to make the [Artisan command][artisan] to run our task! This is easily done using Artisan itself (hilariously). For interest sake, you can run

```bash
php artisan list
```

to see a full list of Artisan commands available to you.


We can look through this list and find the various `make` commands. We will use the following:

```bash
php artisan make:command
```

We should pass the name of the command we want to make, as well as `--addon`, and if you are using the [Sites Module][sites], `--app`. For my module powering this very guide (_finnito.module.guides_) and my site  in the [Sites Module][sites] (_finnito_) it would  look like this:

```bash
php artisan make:command myUsefulCommand --app=finnito
```

This scaffolds a command, but at this stage you need to manually shift it into your addon in this location:

```
addon/src/Console/myUsefulCommamd.php
```

By opening up our newly made `myUsefulCommand.php` we can define a few useful things.

### Defining Your Command
Your command should have (or should make) your commands name. This is what you will pass to Artisan as your command. My command pulls new versions of these posts from [Gitlab][gitlab] so I call it `guides:pull`.

```php
protected $command = ’guides:pull’;
```

### Command Description
You should hopefully know the virtue of good documentation, so give your command a concise but descriptive sentence about what it does. 

```php
protected $description = ’Pull guide updates from Gitlab’;
```

### Handling the Command

The command should be pre-populated with a `handle` function, but if it is not, create one like so:

```php
public function handle() {
    // Do awesome stuff here
}
```

This function is where you do the meat of the work, and really anything can go here. I will not attempt to cover the scope of this, but my function connects to [Gitlab][gitlab] and pulls down file contents for the relevant stream entries in my Guides module. So, it is safe to say that you can do almost anything.

### Registering the Command
The last thing that we need to do is to register the command with the addon service provider located in `module/src/`. 

First, check that your command class is type-hinted at the top of your service provider, e.g.

```php
use Finnito\GuidesModule\Console\PullNewGuides;
```

And then simply add the class to the `$commands` array:

```php
     * The addon Artisan commands.
     *
     * @type array|null
     */
    protected $commands = [
        PullNewGuides::class,
    ];
```

Now your command is ready to go and should appear if you check the Artisan command list.

```bash
php artisan list
```

## Scheduling the Command
[PyroCMS scheduling][pyros] works very similarly to [Laravel scheduling][laravels] and is easily defined. You simply add your command to the `$schedules` variable in your addon service provider like so:

```php
    /**
     * The addon's scheduled commands.
     *
     * @type array|null
     */
    protected $schedules = [
        'dailyAt|6:00' => [
            "guides:pull --app=finnito",
        ],
    ];
```

You can set the interval using familiar old crontab notation or by using more natural-language definitions defined [here in the official docs][pyros].

And there you have it! That is how to make a custom artisan command and to schedule it to run periodically.

## References
* __PyroCMS__: <https://pyrocms.com/>
* __PyroCMS Scheduling__:  <https://pyrocms.com/documentation/streams-platform/1.4/the-basics/service-providers>
* __Laravel Scheduling__: <https://laravel.com/docs/5.6/scheduling>
* __Artisan__: <https://laravel.com/docs/5.6/artisan>
* __Sites Module__: <https://pyrocms.com/documentation/sites-module/1.0/introduction/features>
* __Gitlab__: <https://gitlab.com/Finnito>

[pyro]: https://pyrocms.com/
[pyros]: https://pyrocms.com/documentation/streams-platform/1.4/the-basics/service-providers
[laravels]: https://laravel.com/docs/5.6/scheduling
[artisan]: https://laravel.com/docs/5.6/artisan
[sites]: https://pyrocms.com/documentation/sites-module/1.0/introduction/features
[gitlab]: https://gitlab.com/Finnito
