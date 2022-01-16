#!/usr/bin/env bash

source ~/.profile

dest=~/Sites/public.finn.lesueur.nz/

hugo server \
	--disableFastRender \
	--forceSyncStatic \
	--renderToDisk \
	--gc \
	--noHTTPCache \
	--buildDrafts \
	--destination="$dest"
