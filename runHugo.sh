#!/usr/bin/env bash

source ~/.profile

dest=~/Sites/public.finn.lesueur.nz/

hugo server \
	--disableFastRender \
	--forceSyncStatic \
	--buildDrafts \
	--renderToDisk \
	--gc \
	--noHTTPCache \
	--port=8888 \
	--minify \
	--destination="$dest" \
	--enableGitInfo \
	--verbose
