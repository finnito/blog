---
title: "OmniFocus: Using the iOS URL Scheme"
date: 2018-09-07T13:59:21+13:00
slug: "omnifocus-ios-url-scheme"
emoji: 💻
metaDescription: "URL schemes are indispensable to anyone who uses iOS heavily and dabbles in automation. Read on to get an introductory guide to using the OmniFocus URL scheme to supercharge your iOS productivity!"
metaImage: "OmniFocus-URL-Scheme.png"
prism: "true"
---

URL schemes are indispensable to anyone who uses iOS heavily and dabbles in automation. They allow users to make deep-links into apps and to automate actions using apps such as [Siri Shortcuts][ss], [Editorial][ed] or [Drafts][dr].
_Because Shortcuts is in beta until iOS 12, I will use Workflow until it is released and I can update this post._

Thankfully, the [OmniGroup][og] who is behind the incredibly flexible and powerful task manager, [OmniFocus][of], has an extensive and well-documented URL scheme! I will link to the original web pages documenting the scheme but will go through the format and usage of some of the more useful URLs. A common and user-friendly way to use URL schemes is through [Siri Shortcuts][ss] (formerly Workflow). I will give some examples of how the schemes could be used with Shortcuts and for more a more in-depth scripting usage you may refer to an [OmniForm post][ofp] written by [Ken Case][kc].

## URLs in Apple Shortcuts
In order to open a URL in [Siri Shortcuts][ss] simply place a _URL_ action and populate it with the URL you desire and follow it with a _Open URLs_ action.

### URL Structure
For those new to URL schemes on iOS, the base URL structure somewhat resembles a browser-based URL.

```
appSlug:///
```

## Deep Linking into OmniFocus

### Home Page
The most simple URL for an app is one without path or arguments. A URL of this form would simply open the home page of the app. For OmniFocus this is as follows:

```
omnifocus:///
```

### Inbox, Flagged, Projects, Nearby, Contexts & Review
These views are the main staple of any OmniFocus user and you can speed up your usage of them by creating shortcuts to them using the following schemes:

```
omnifocus:///inbox
omnifocus:///flagged
omnifocus:///projects
omnifocus:///nearby
omnifocus:///contexts
omnifocus:///review
```
It is very simple to create a Shortcut where you select which view you would like to open using a _Select from Menu_ action and a _Open URLs_ action at the end. I have made this shortcut as a demo - get it here!

[Check out my example OmniFocus quick view flow here.][ofquickview]

### Forecast, Past, Today, Soon & Custom Perspectives
If you are keen to link to any of the perspectives built into OmniFocus or to one of your own custom perspectives, this is achieved easily like before!

```
omnifocus:///forecast
omnifocus:///past
omnifocus:///today
omnifocus:///soon
```
And if you want to link to a custom perspective that you have created (e.g. My Awesome Perspective), you can simply do this:

```
omnifocus:///perspective/My%20Awesome%20Perspective
```
One thing to note here is that if your perspective has any characters other than letters or numbers, you should URL encode it! Thankfully, [Shortcuts][ss] has an action that does just that. An example of how you might do it is below.

[Check out my example OmniFocus perspective opening flow here.][ofperspective]


### Searching
You can also open up a custom search straight off the bat by using the search URL. This can easily be augmented by replacing the string below with an `Ask When Run` variable.

```
omnifocus:///search?q=string
```

_It is important to note that the 'search' string should be URL encoded as demonstrated earlier._

[Check out my example OmniFocus search flow here.][ofsearch]

### Opening a Folder
You can also simply open a folder using the folder URL much like the search URL.

```
omnifocus:///folder/folder-id
```

_It is important to note that the 'folder-id' string should be URL encoded as demonstrated earlier._

[Check out my example OmniFocus folder opening flow here.][offolder]

### Opening a Project
And following the above trend, you can also open to a project with a similar URL.

```
omnifocus:///task/task-id
```

_It is important to note that the 'task-id' string should be URL encoded as demonstrated earlier._

[Check out my example OmniFocus project opening flow here.][ofproject]


## References
- __Siri Shortcuts__: <https://www.imore.com/siri-shortcuts-faq>
- __OmniGroup__: <https://www.omnigroup.com/>
- __OmniFocus__: <https://www.omnigroup.com/omnifocus/ios>
- __Editorial__: <http://omz-software.com/editorial/>
- __Drafts__: <https://getdrafts.com/>
- __OmniForum Post__: <https://discourse.omnigroup.com/t/implementation-details-for-omnifocus-2-14-automation/24179>
- __Ken Case__: <https://twitter.com/kcase>
- __OmniFocus Quick View Shortcut__: <https://workflow.is/workflows/f78d4e2303454a7fbbd8346dd41925c5>
- __OmniFocus Perspective Shortcut__: <https://workflow.is/workflows/329d62f5c5ce41669fecd8e86a3bf0a2>
- __OmniFocus Search Shortcut__: <https://workflow.is/workflows/90e65b30ddcb43af864c06e312e0a6be>
- __OmniFocus Folder Shortcut__: <https://workflow.is/workflows/c65cdd98379d49e5bf9261087d4267b4>
- __OmniFocus Project Shortcut__: <https://workflow.is/workflows/d41a3ec96ec349a68cc6307fd265373f>

[ss]: https://www.imore.com/siri-shortcuts-faq
[og]: https://www.omnigroup.com/
[of]: https://www.omnigroup.com/omnifocus/ios
[ed]: http://omz-software.com/editorial/
[dr]: https://getdrafts.com/
[ofp]: https://discourse.omnigroup.com/t/implementation-details-for-omnifocus-2-14-automation/24179
[kc]: https://twitter.com/kcase
[ofquickview]: https://workflow.is/workflows/f78d4e2303454a7fbbd8346dd41925c5
[ofsearch]: https://workflow.is/workflows/90e65b30ddcb43af864c06e312e0a6be
[offolder]: https://workflow.is/workflows/c65cdd98379d49e5bf9261087d4267b4
[ofproject]: https://workflow.is/workflows/d41a3ec96ec349a68cc6307fd265373f
[ofperspective]: https://workflow.is/workflows/329d62f5c5ce41669fecd8e86a3bf0a2