#!/usr/bin/env bash

dest=~/Sites/public.finn.lesueur.nz/

hugo server \
    --disableFastRender \
    --navigateToChanged \
    --forceSyncStatic \
    --buildDrafts \
    --renderStaticToDisk \
    --openBrowser \
    --logLevel debug \
    --navigateToChanged \
    --noHTTPCache \
    --port=8888 \
    --minify \
    --destination="$dest" \
    --printUnusedTemplates \
    --printPathWarnings \
    --enableGitInfo
