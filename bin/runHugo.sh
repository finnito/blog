#!/usr/bin/env bash

dest=~/Sites/public.finn.lesueur.nz/

hugo server \
    --bind="0.0.0.0" \
    --baseURL="https://tardis.tail49ff1.ts.net/" \
    --appendPort=false \
    --navigateToChanged \
    --forceSyncStatic \
    --buildDrafts \
    --renderStaticToDisk \
    --disableFastRender \
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
