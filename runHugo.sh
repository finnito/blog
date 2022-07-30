#!/usr/bin/env bash

source ~/.profile

dest=~/Sites/public.finn.lesueur.nz/

hugo server \
	--disableFastRender \
	--forceSyncStatic \
	--renderToDisk \
	--cleanDestinationDir \
	--gc \
	--noHTTPCache \
	--buildDrafts \
	--buildFuture \
	--port=8888 \
	--destination="$dest" \
	--enableGitInfo
