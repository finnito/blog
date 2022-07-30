#!/usr/bin/env bash

python3 stats.py

dest=~/Sites/public.finn.lesueur.nz/

rm -r ~/Sites/public.finn.lesueur.nz/

hugo --config="config.toml" --destination="$dest"

rsync \
	--archive \
	--compress \
	--delete \
	--stats \
	--progress \
	--chown=www-data:www-data \
	~/Sites/public.finn.lesueur.nz/ \
	root@172.105.169.195:/srv/finn.lesueur.nz/
