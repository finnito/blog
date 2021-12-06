---
title: How To Initiate Sidecar From iOS
slug: initiate-sidecar-from-ios
date: 2020-04-22T20:57:59+12:00
categories: ["iPad", "Development"]
metaDescription: "Learn how to initiate Sidecar from iOS so you can connect to a headless Mac!"
metaImageURL: "/posts/initiate-sidecar-from-ios/shortcut-to-initiate-sidecar-from-ios.png"
---

Sidecar is wonderful and adds a huge amount of functionality to an already awesome iPad Pro 12.9" - but let's say that I want to connect to a headless Macbook Pro (or Mac Mini) in the future. How can I initiate Sidecar from the iPad end of the equation?

<!--more-->

After much searching I concluded that Sidecar does not have a CLI, or at least not one I can find discussed __at all__.

## The Solution - AppleScript & SSH

While old and not overly well maintained, AppleScript has a huge amount to offer with regards to MacOS automation. Simply create a file `initiateSidecar.scpt` wherever suits you.

```applescript
activate application "SystemUIServer"
tell application "System Events"
    tell process "SystemUIServer"
        set displayMenu to (menu bar item 1 of menu bar 1 whose description contains "Displays")
        tell displayMenu
            click
            delay 1
            tell (menu item "iPad" of menu 1)
                click
            end tell
        end tell
    end tell
end tell
```

You can call AppleScript on the commandline with `osascript yourScriptName.scpt`. Just be aware that the first time you run it you will need to grant some extra permissions, so it will not work on first-run.

Then, from your iPad end, create a Shortcut that runs a SSH command on your Mac and add it to your homescreen widget - [download it here][shortcut]! Easy!

{{< figure name="shortcut-to-initiate-sidecar-from-ios" title="Shortcut to initiate Sidecar from iOS" author="Finn Le Sueur">}}

This has already been a huge improvement for me. Enjoy!

## References
- [Sidecar Shortcut][shortcut]
- [Reddit Discussion][reddit]

[shortcut]: https://www.icloud.com/shortcuts/fc7dea1568204200aede157cf0c28fd1 "Download Sidecar Shortcut"
[reddit]: https://www.reddit.com/r/shortcuts/comments/fzjlil/initiate_sidecar_from_ipad/fn509uh/ "Reddit Discussion"
