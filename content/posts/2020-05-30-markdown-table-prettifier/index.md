---
title: "Markdown Table Prettifier - A Scriptable action to make your Markdown tables more readable."
date: 2020-04-30T14:03:47+12:00
slug: "markdown-table-prettifier"
categories: ["iPad", "Development", "Project"]
metaDescription: "A small Scriptable action that parses text to find Markdown tables and pad the cells to make them more readable."
metaImage: "markdown-table-prettifier-og-image.png"
prism: "true"
---

__Gitlab:__ [Markdown Table Prettifier](https://gitlab.com/Finnito/scriptable-markdown-table-prettifier)

This is a small [Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188) action (JS) that prettifies [Markdown tables](https://daringfireball.net/projects/markdown/syntax) for better readability.

Simply highlight the text containing the table(s), open the Share Sheet and run the script from Scriptable. You can highlight your whole document and it will find all the tables within it and prettify them all.

<!--more-->

__Before__

```markdown
|   | AR | ER | IR |
|---|---|---|---|
| Yo | o | o | o |
| El/Ella | a | e | e |
| Tu/Usted | as | es | es |
| Nosotros | amos | emos | imos |
| Vosotros | áis  | éis | ís |
| Ellos/Ellas/Ustedes | an | en | en |
```

__After__ 

```markdown
|                      | AR    | ER    | IR    |
|----------------------|-------|-------|-------|
| Yo                   | o     | o     | o     |
| El/Ella              | a     | e     | e     |
| Tu/Usted             | as    | es    | es    |
| Nosotros             | amos  | emos  | imos  |
| Vosotros             | áis   | éis   | ís    |
| Ellos/Ellas/Ustedes  | an    | en    | en    |
```

## Installation

1. Install [Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188)
2. [Download the script](https://gitlab.com/Finnito/scriptable-markdown-table-prettifier/-/raw/master/Markdown%20Table%20Prettifier.scriptable?inline=false)
3. Place it in the Scriptable folder in your iCloud Drive
4. Open your text editor, highlight the text and go!

Feel free to open an issue if you encounter any problems!

-- Finn 👋