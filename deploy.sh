#!/usr/bin/env bash

python3 stats.py

rm -r ~/Sites/public.finn.lesueur.nz/

hugo --config="config.toml" --destination="$HOME/Sites/public.finn.lesueur.nz/"

rsync \
	--archive \
	--compress \
	--delete \
	--stats \
	--progress \
	--chown=www-data:www-data \
	--rsh="ssh -p29163" \
	"$HOME/Sites/public.finn.lesueur.nz/" \
	root@172.105.169.195:/srv/finn.lesueur.nz/
