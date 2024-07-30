#!/usr/bin/env bash

dest=~/Sites/public.finn.lesueur.nz/

hugo server \
	--disableFastRender \
	--forceSyncStatic \
	--buildDrafts \
	--renderToDisk \
	--gc \
 	--logLevel info \
  	--navigateToChanged \
	--noHTTPCache \
	--port=8888 \
	--minify \
	--destination="$dest" \
	--enableGitInfo \
	--verbose \
	--debug
