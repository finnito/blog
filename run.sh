#!/usr/bin/env bash

set -euo pipefail

function serve_tailscale {
	tailscale serve localhost:8888	
}

function run_hugo {
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
	    --logLevel=debug \
	    --navigateToChanged \
	    --noHTTPCache \
	    --port=8888 \
	    --minify \
	    --destination="$dest" \
	    --printUnusedTemplates \
	    --printPathWarnings \
	    --enableGitInfo
}

function watch_gpx {
	source venv/bin/activate

	fswatch \
		--print0 \
		--recursive \
		--exclude='.*' \
		--include='.gpx' \
		/Volumes/web/dam/blog | xargs \
			-0 \
			-I {} \
			python3 bin/parse_gpx_single_file.py {}
}


# Source - https://stackoverflow.com/a/52033580
# Posted by Quinn Comendant, modified by community. See post 'Timeline' for change history
# Retrieved 2026-07-14, License - CC BY-SA 4.0
(trap 'kill 0' SIGINT; serve_tailscale & run_hugo & watch_gpx)
