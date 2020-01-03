---
title: "PyroCMS 3: Twig Template Variables"
date: 2018-08-23T13:54:59+13:00
categories: ["Development", "PyroCMS"]
metaDescription: "Learn the basics about how to use Twig template variables with PyroCMS 3 and supercharge your theme-creation powers!"
metaImageURL: "Twig-Variables.png"
---

A pretty basic part of an HTML document is using `<meta/>` and other tags to add metadata to a page so that browsers and search engines can read it. There is any number of tags that you might want to include in your `<head>` element, but let us use the `<title>` tag as a starting point.

```html
<title>A Really Great Site</title>
```

## Template Variables
In [PyroCMS 3][pyro-3] official addons such as [Pages][pages] populate some [Twig][twig] template variables for you so that instead of (somehow) writing a bunch of if statements so that each page gets the correct title and description, you can do this:

```html
<title>{{ template.meta_title }}</title>
```

The double `{` bracket indicates that the value of the variable will be inserted into the document. This is great - it means that we can easily create a template for our required header elements and have them automatically filled in.

## How to Set Template Variables
Now that we know how to output template variables in [Twig][twig], we need to know how to set them. This will help us work with template variables when constructing our own addons where this functionality needs to be manually added. The most logical place to add this is within your controller located in `module/src/Http/Controller` or within `module/src/Http/Controller/Admin` if you are writing an admin controller.

The most basic controller may look like this, where it finds an item from the repository and renders the page, or it posts a 404 if the item is not found.

```php
public function singleItem(
    $itemSlug,
    ItemRepositoryInterface $items,
) {
    // Find the page or 404 not found
    if (!$item = $items->findBySlug($itemSlug)) {
        abort(404);
    }

    // Construct the view!
    return $this->view->make(
        "finnito.module.items::singleItem"
    );
}
```

To be able to access the ViewTemplate we need to type hint it in the top of our view controller file. Simply add the following:

```php
use Anomaly\Streams\Platform\View\ViewTemplate;
```

Next, we need to pass it to our function so that we can access it:

```php
public function singleItem(
    $itemSlug,
    ItemRepositoryInterface $items
    ViewTemplate $template,
) {
    // Find the page or 404 not found
    if (!$item = $items->findBySlug($itemSlug)) {
        abort(404);
    }

    // Construct the view!
    return $this->view->make(
        "finnito.module.items::singleItem"
    );
}
```

Now that we can access ViewTemplate within our function it is trivial to set some template variables. The syntax is simply:

```php
$template->set('meta_title', $item->getTitle());
```

In order for this to work, we need to ensure that there exists a `getTitle()` method on the ItemModel. Open up your model file (eg. `module/src/Item/ItemModel.php`) and add a simple function like this:

```php
public function getTitle() {
    return $this->title;
}
```
Whatever attribute of the Item that you return should correspond to the slug of the field which represents the title in your model. For example it might be `meta_title` or `name` or `post_title` instead of simply `title`. 

One last step is to add this method to the `ItemInterface` which is located in my case at `module/src/Item/Contract/ItemInterface.php`. Here you only need to give the function without giving its contents, like so:

```php
public function getTitle();
```

With all that completed, our controller function might now look like this in its entirety:

```php
<?php namespace Finnito\ItemsModule\Http\Controller;

use Anomaly\Streams\Platform\Http\Controller\PublicController;
use Finnito\ItemsModule\Item\Contract\ItemRepositoryInterface;
use Anomaly\Streams\Platform\View\ViewTemplate;


class ItemController extends PublicController {

    public function singleItem(
        $itemSlug,
        ItemRepositoryInterface $items,
        ViewTemplate $template
    ) {
        // Find the guide or 404 not found
        if (!$item = $items->findBySlug($itemSlug)) {
            abort(404);
        }
        
        // Set the title variable!
        $template->set('meta_title', $item->get_title());


        // Construct the view!
        return $this->view->make(
            "finnito.module.items::series/single"
        );
    }
}
```

And using the [Twig][twig] syntax mentioned at the top, your item pages should now have nice titles!

## References
- PyroCMS 3: https://pyrocms.com/
- PyroCMS 3 Pages Module: https://pyrocms.com/documentation/pages-module
- Twig: https://twig.symfony.com/doc/2.x/templates.html

[pyro-3]: https://pyrocms.com/
[pages]: https://pyrocms.com/documentation/pages-module
[twig]: https://twig.symfony.com/doc/2.x/templates.html
