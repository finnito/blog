#!/usr/bin/env bash

set -o errexit   # abort on nonzero exitstatus
set -o nounset   # abort on unbound variable
set -o pipefail  # don't hide errors within pipes

on_error(){
	curl \
		--silent \
		--form-string "t=Blog CI Failure" \
		--form-string "m=finn.lesueur.nz CI has failed." \
		--form-string "d=59496" \
		--form-string "k=pd0cruRXVFrQz6CyGJNh" \
		https://www.pushsafer.com/api
}
trap 'on_error' ERR

cd "$HOME/CI/blog"

git fetch

localHash=$(cat .git/refs/heads/master)
remoteHash=$(cat .git/refs/remotes/origin/master)

# printf "=== Comparing ===\nLocal  Hash: %s\nRemote Hash: %s\n" "$localHash" "$remoteHash"

if [[ "$localHash" != "$remoteHash" ]]; then
	# Enter Python3 venv
	source venv/bin/activate

	# CI is behind master.
	# Get most recent changes then deploy.
	git pull origin master
	
	# Rebuild gpx-->json data files
	time --format="parse_gpx.py: %es" python3 parse_gpx.py

	# Build site with Hugo
	time --format="hugo: %es" \
		./hugo \
		--config="config.toml" \
		--verbose \
		--destination="$HOME/CI/blog-build/"

	# Sync build to server
	time --format="rsync: %es" \
		rsync \
		--archive \
		--compress \
		--delete \
		--stats \
		--chown=www-data:www-data \
		--rsh="ssh -p29163" \
		"$HOME/CI/blog-build/" \
		root@172.105.169.195:/srv/finn.lesueur.nz/

	# Leave Python3 venv
	deactivate

	# Send success notification to phone
	message=$(cat "$HOME/CI/blog-logfile-$(date +'%Y-%m-%d').log")
	curl \
		--silent \
		--form-string "t=Blog Rebuilt" \
		--form-string "m=$message" \
		--form-string "d=59496" \
		--form-string "k=pd0cruRXVFrQz6CyGJNh" \
		https://www.pushsafer.com/api
fi
