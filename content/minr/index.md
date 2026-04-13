---
title: mINR | Medication Tracker
date: 2023-12-15
emoji: 🩸
---

I built this app as a hobby project in early 2023 when I received news that I was to get a [heart valve replacement](/posts/a-heart-murmur/). As I was opting for a mechanical heart valve, I would have to been on [warfarin](https://en.wikipedia.org/wiki/Warfarin) (an anticoagulant) for the rest of my life. This means daily medication which needs to be adjusted as my diet and kidney function changes throughout my life. Most patients would record their medications in [a little notebook](https://healthify.nz/assets/Brochures/my-warfarin-and-inr-diary-210811.pdf), but, being technology oriented I figured an app would be better!

![mINR promotional image showing a variety of screenshots.](/minr/minr-promo.png)

## Key Links

1. [App Store Page](https://apps.apple.com/us/app/minr/id6448668274)
2. [Help Page](https://finn.lesueur.nz/minr/minr-help.html)
3. [YouTube Tutorials](https://www.youtube.com/watch?v=yVN11Ma8QB8&list=PLTY6jHvfu9gAFMdkLRBg-X7ROyr-J5_pw)
4. [Privacy Policy](https://finn.lesueur.nz/minr/minr-privacy-policy.html)

## Version History

<details open>
    <summary>2026.1 (Jan 21, '26)</summary>
    <ul>
        <li><mark>Feature: Adds ability to log half-mg doses (e.g. 2.5mg, 7.5mg).</mark>
        <li>Feature: Adds interactive widgets (dashboard & quick-entry).
        <li>Feature: Adds average dose (mg/day) information to the "All INR" view.
        <li>Feature: Improve Shortcuts actions.
        <li>Fix: Dismiss medication reminder when a dose is logged.
        <li>Fix: Improve the code backing icon-changing.
        <li>Fix: Hide non-user-facing AppIntents from Siri.
        <li>Fix: Various layout and UI tweaks and improvements to consistency.
    </ul>
</details>


<details>
    <summary>2023.4 (Dec 17, '23)</summary>
    <ul>
        <li>Feature: Adds ability to customise the app icon.
        <li>Feature: Adds quick-add dose buttons to the medication reminder.
        <li>Feature: Adds a first-run view for quick setup.
        <li>Feature: Sprinkle some icons around the app.
        <li>Feature: Adds a display showing when data was last exported.
        <li>Feature: Adds basics anticoagulant statistics.
        <li>Feature: Styles "Add Dose/INR" buttons according to use settings & tints "Add Data" buttons.
        <li>Feature: Implements TipKit with two initial tips.
        <li>Feature: Adds bottom-accessible bar for adding doses, improves top menu bar and adds tips.
        <li>Fix: show the correct most recent dose in the medication notification text.
        <li>Fix: Make the chart view, calendar view, and chart widget responsive to dark mode.
        <li>Fix: Changing "Compliance" --> "Adherence".
        <li>Fix: Give proper titles and descriptions to widgets.
        <li>Fix: Implement widget containerBackground and fix margins for iOS 17.
        <li>Fix: Allow for background updating of CoreData (try avoid a rare crash).
        <li>Fix: Improve colour coordination throughout app via preferences.
        <li>Fix: Changes the help page URL.
        <li>Fix: Make the add sheets a bit taller.
        <li>Fix: Crashing bug in Adherence Calendar & improve decorations rendering.
        <li>Fix: Minor aesthetic improvements to small and accessory widgets.
        <li>Fix: Uses Stepper() instead of Text() to add and edit INR entries.
        <li>Fix: Switches big INR and Dose buttons for quicker access to add a new dose.
        <li>Fix: Uses system colour for home screen background colour.
        <li>Fix: Sets more appropriate initial dataPointWidth and card background colours.
        <li>Development: Use Logger() instead of print.
        <li>Development: Add, improve and remove some Previews.
    </ul>
</details>

<details>
    <summary>2023.3 (Jul 10, '23)</summary>
    <ul>
        <li>Uses Stepper for easier anticoagulant input.
        <li>Improves consistency of some colours.
        <li>Improves the layout of the INR/anticoagulant input sheets.
        <li>Fixes a widget display bug for high anticoagulant doses.
        <li>Fixes a bug in the "All Anticoagulant Data" views.
        <li>Makes the In-App Purchase buttons more prominent.
        <li>Improves the developer experience.
    </ul>
</details>

<details>
    <summary>2023.2 (Jul 5, '23)</summary>
    <ul>
        <li>An improved saving of last dose/INR measurements for quicker entry.
        <li>A note field for when your dose changes.
        <li>A lock screen widget showing your latest dose and INR measurement.
        <li>Data export.
    </ul>
</details>

<details>
    <summary>2023.1 (Jun 19, '23)</summary>
    <ul>
        <li>Initial release!
    </ul>
</details>
