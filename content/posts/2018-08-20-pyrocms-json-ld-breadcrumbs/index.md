---
title: "PyroCMS 3: JSON-LD and Breadcrumbs"
date: 2018-08-20T13:36:34+13:00
slug: "pyrocms-json-ld-breadcrumbs"
categories: ["Development", "PyroCMS"]
metaDescription: "Having a nice looking search card on Google is all part of Search Engine Optimisation. Learn how to make JSON-LD breadcrumbs using PyroCMS 3 & Twig!"
metaImageURL: "JSON-LD.png"
---

Having a nice looking search card on Google is all part of Search Engine Optimisation. Thankfully, [PyroCMS 3][p3] has a great breadcrumbing implementation built in and we can leverage this to easily generate semantic HTML markup and some lovely [JSON-LD][jld].

## What is a Breadcrumb?
Often they are used to display the branch of the page you are on within the site hierarchy. For example, on my website there is a top level page ‘Writing’ which has a child page ‘SEO’ which has a child page ‘PyroCMS 3 + JSON-LD: Breadcrumbs’. This can be displayed as follows (with a link to each page): 

```
Writing / SEO / PyroCMS 3  + JSON-LD: Breadcrumbs
```

### Marking Up a Breadcrumb Trail
Thankfully, Google has a great set of documentation [here][breaddoc]. But a simple example the HTML is used on this very website.

```html
<ol class="breadcrumb">
    <li>
        <a  href="/writing"
            title="Breadcrumb: My Writing">Writing</a>
        /
    </li>
    <li>
        <a  href="/writing/test-series"
            title="Breadcrumb: My Writing: Test Series">
            Test Series
        </a>
        /
    </li>
    <li>
        <a  href="/writing/test-series/test-guide"
            title="Breadcrumb: Test Series: Test Guide">
            Test Guide
        </a>
    </li>
</ol>
```

## PyroCMS 3 Breadcrumbs
[PyroCMS 3 comes with a built in system for managing breadcrumbs][py3b]. If you are using the 1st party addons such as the [Pages][py3pages] addon, the array of breadcrumbs will be automatically populated.

### Adding PyroCMS 3 Breadcrumbs
When working with a custom addon you need to add the breadcrumbs to the array manually. This may involve a method that generates the URL for each page if the structure is complicated - but I have opted for generated the URL in-place at the moment.

I will the use my Guides module that powers this very post as an example. To render the post without worrying about breadcrumbs it uses a `PublicController` like this:

```php
<?php namespace Finnito\GuidesModule\Http\Controller;

use Anomaly\Streams\Platform\Http\Controller\PublicController;
use Finnito\GuidesModule\Guide\Contract\GuideRepositoryInterface;
use Finnito\GuidesModule\Series\Contract\SeriesRepositoryInterface;

class WritingController extends PublicController {

    public function singlePost(
        $seriesSlug,
        $guideSlug,
        GuideRepositoryInterface $guides,
        SeriesRepositoryInterface $allSeries,
    ) {
        // Find the guide or 404 not found
        if (!$guide = $guides->findBySlug($guideSlug, $seriesSlug)) {
            abort(404);
        }
        $series = $allSeries->findBySlug($seriesSlug);
            
        // Construct the view!
        return $this->view->make(
            "finnito.module.guides::series/single",
            compact("guide"),
            compact("series")
        );
    }
}
```
When extending a `PublicController` or `AdminController` the breadcrumbs are automatically available through `$this->breadcrumbs`. Conveniently, there is a method that lets us add breadcrumbs very simply:

```php
$this->breadcrumbs->add(
    $breadcrumbTitle,
    $breadcrumbURL
);
```
Before we start, a word about my post hierarchy. I have a parent page *Writing*, which has a child page for each *Series* and these each have a child page for each post within the series. So we need to add three breadcrumbs to the trail.

```php
<?php namespace Finnito\GuidesModule\Http\Controller;

use Anomaly\Streams\Platform\Http\Controller\PublicController;
use Finnito\GuidesModule\Guide\Contract\GuideRepositoryInterface;
use Finnito\GuidesModule\Series\Contract\SeriesRepositoryInterface;

class WritingController extends PublicController {

    public function singlePost(
        $seriesSlug,
        $guideSlug,
        GuideRepositoryInterface $guides,
        SeriesRepositoryInterface $allSeries,
    ) {
        // Find the guide or 404 not found
        if (!$guide = $guides->findBySlug($guideSlug, $seriesSlug)) {
            abort(404);
        }
        $series = $allSeries->findBySlug($seriesSlug);
        
        // Setup the breadcrumbs
        $this->breadcrumbs->add(
            "My Writing",
            "/writing"
        );
        $this->breadcrumbs->add(
            $series->name,
            "/writing/{$series->slug}"
        );
        $this->breadcrumbs->add(
            $guide->name,
            "/writing/{$series->slug}/{$guide->slug}"
        );
            
        // Construct the view!
        return $this->view->make(
            "finnito.module.guides::series/single",
            compact("guide"),
            compact("series")
        );
    }
}
```
### Rendering The Breadcrumbs
Now that we have added the breadcrumbs for our custom addon we can simply render them out like so into our HTML:

```html
<ol class="breadcrumb">
    {% for key, url in template.breadcrumbs %}

        {% if loop.last %}
            <li class="active">{{ trans(key) }}</li>
        {% else %}
            <li><a href="{{ url }}">{{ trans(key) }}</a></li>
        {% endif %}

    {% endfor %}
</ol>
```

## Breadcrumbs & JSON-LD
Getting back to SEO and how breadcrumbs are useful. They are an enhancement that Google can add to your search card when your page is returned as a search result. But this requires good HTML markup and some JSON-LD (or other another format. Google recommends JSON-LD so let's go with that!

[JSON-LD is a reasonably large spec with a lot of attributes that can more easily let algorithms parse your website for useful information, but let us start with breadcrumbs][breaddoc]. We write our JSON inside a `<script>` HTML tag as you may expect, and the markup for a breadcrumb is as follows:

```javascript
<script type='application/ld+json'>
{
    "@context": "http://www.schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": "1",
        "item": {
          "@id": "finnito.nz/writing",
          "name": "My Writing"
        }
      }
    ]
  }
</script>
```

But what we want to do is to render out the breadcrumb in full automatically so we can employ our Twig knowledge to loop through the array and produce something like this:

```javascript
<script type='application/ld+json'>
[
  {
    "@context": "http://www.schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {% for key, url in template.breadcrumbs %}
      {
        "@type": "ListItem",
        "position": "{{ loop.index }}",
        "item": {
          "@id": "{{ url }}",
          "name": "{{ key }}"
        }
      }
      {% if not loop.last %}
      ,
      {% endif %}
      {% endfor %}
    ]
  }
]
</script>
```

And there we have it! Now it is your turn to add some breadcrumbs to your website and get a much prettier Google search card!

## References
- PyroCMS 3: <https://pyrocms.com>
- PyroCMS 3 Breadcrumbs: <https://pyrocms.com/documentation/streams-platform/1.4/ui/breadcrumbs>
- PyroCMS 3 Pages Module: <https://pyrocms.com/documentation/pages-module>
- PyroCMS 3 Views: <https://pyrocms.com/documentation/streams-platform/1.4/the-basics/views>
- Google Search Breadcrumbs: <https://developers.google.com/search/docs/data-types/breadcrumb>
- JSON-LD: <https://json-ld.org/>


[p3]: https://pyrocms.com
[py3b]: https://pyrocms.com/documentation/streams-platform/1.4/ui/breadcrumbs
[py3pages]: https://pyrocms.com/documentation/pages-module
[py3view]: https://pyrocms.com/documentation/streams-platform/1.4/the-basics/views
[breaddoc]: https://developers.google.com/search/docs/data-types/breadcrumb
[jld]: https://json-ld.org/