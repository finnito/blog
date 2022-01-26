#!/usr/bin/env bash

hugo --config="config.toml"

rsync \
	--archive \
	--compress \
	--progress \
	--delete \
	--chown=www-data:www-data \
	/Users/finnlesueur/Sites/public.finn.lesueur.nz/ \
	root@172.105.169.195:/srv/finn.lesueur.nz/
