#!/usr/bin/env bash

osascript -e 'tell application "Safari"
    tell window 1
        --options
        set myTab to tab 1
        set myTab to first tab whose URL starts with "http://finn.test"
        if current tab is not myTab then set current tab to myTab
        tell myTab to do JavaScript "location.reload();"
    end tell
end tell'