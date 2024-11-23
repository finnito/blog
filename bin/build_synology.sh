#!/usr/bin/env bash

# Get Python venv setup
python -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

# Build GPS json files
mkdir --parents data/gpx
mkdir --parents static/tracks
python bin/parse_gpx.py /volume1/web/dam/blog/

# Build Hugo
hugo \
	--cleanDestinationDir \
	--enableGitInfo \
	--gc \
	--forceSyncStatic \
	--minify \
	--destination /volume1/web/finn.lesueur.nz/
