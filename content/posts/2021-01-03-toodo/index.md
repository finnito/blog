---
title: "tooDo"
slug: "toodo"
date: 2021-01-03T13:20:30+13:00
categories: ["Development", "Python", "MacOS"]
metaDescription: "Find the FIX/NOTE/TODO tasks in your source files, across multiple directories!"
metaImageURL: "https://github.com/finnito/tooDo/blob/main/gui-screenshot.png?raw=true"
git: https://github.com/finnito/tooDo
---

A simple but effective way to leave comments to your future self, and other programmers is to put stuff like this in code:

```html
</article>
<!-- NOTE: I don't know why this works. Do not touch. -->
...
```

There are ways to view all of these comments in you code, for example, the [Sublime Text Todo Review plugin](https://github.com/jfcherng-sublime/ST-TodoReview). But! What if you want to do this for multiple directories and view them all in one window?
 
__Enter:__ TooDo.

<!--more-->

> Find the FIX/NOTE/TODO tasks in your source files!

This is a fun weekend project for me, but I am all for learning, so [let me know](https://github.com/Finnito/tooDo/issues) if things don't work, or you have a feature request.

![The real basic GUI.](https://github.com/finnito/tooDo/blob/main/gui-screenshot.png?raw=true)

## How to Use

1. Clone this repository
2. Install requirements (`fswatch`, `toml`)
    - `python3 -m pip install -r requirements.txt`
3. Open `config.toml` and define the directories you want to watch, like this:

```toml
[directories]
    [directories.tooDo]
        path = "/Users/finnlesueur/Git/tooDo/"
        ignore_paths = [
            "venv"
        ]
        ignore_types = [
            ".html",
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".gpx",
            ".min.js",
        ]
```

4. Run the script!
    - `python tooDo.py`
    - I personally made an [Automator](https://support.apple.com/en-au/guide/automator/welcome/mac) app which simply calls this script so I can boot it from [Alfred](https://www.alfredapp.com).

### Customisation

You may wish to customise the FIX/TODO/NOTE/whateveryouwant patterns being searched for. You can do this in `config.toml`

```toml
[patterns]
    [patterns.FIX]
        regex = "FIX:\\s*(.*)"
    [patterns.TODO]
        regex = "TODO:\\s*(.*)"
    [patterns.NOTE]
        regex = "NOTE:\\s*(.*)"
```

You can also change the font family, font size, font colour, background colour and colour of the currently selected line.

```toml
[display]
    background = "#ecf0f1"
    text = "#1e272e"
    current_line = "#badc58"
    font_family = 'Space Mono'
    font_size = 13
    font_size_big = 16
```

You may also wish to crank up how often changes to the todo list are checked for. It is set by default to `1000ms` which seems perfectly good to me. It will use lots more CPU if you make it excessively small.

```toml
[settings]
    tk_refresh_rate = 1000
```

---

### Dependencies

- [pyfswatch](https://github.com/paul-nameless/pyfswatch)
    + MIT License
- [toml](https://github.com/uiri/toml)
    + MIT License 