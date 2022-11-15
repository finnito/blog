#!/usr/bin/env bash

set -o errexit   # abort on nonzero exitstatus
set -o nounset   # abort on unbound variable
set -o pipefail  # don't hide errors within pipes

on_error(){
	curl --form-string "t=Blog CI Failure" \
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

if ["$localHash" != "$remoteHash"]; then
if [[ "$localHash" != "$remoteHash" ]]; then
	# Enter Python3 venv
	source venv/bin/activate

	# CI is behind master.
	# Get most recent changes then deploy.
	git pull origin master
	
	# Rebuild gpx-->json data files
	python3 stats.py

	# Remove last build
	rm -r "$HOME/CI/blog-build"

	# Build site with Hugo
	./hugo --config="config.toml" --destination="$HOME/CI/blog-build/"

	# Sync build to server
	rsync \
		--archive \
		--compress \
		--delete \
		--stats \
		--progress \
		--chown=www-data:www-data \
		--rsh="ssh -p29163" \
		"$HOME/CI/blog-build/" \
		finn@172.105.169.195:/srv/finn.lesueur.nz/

	# Leave Python3 venv
	deactivate

	# Send success notification to phone
	curl --form-string "t=Blog Rebuilt" \
		--form-string "m=finn.lesueur.nz rebuilt using CI." \
		--form-string "d=59496" \
		--form-string "k=pd0cruRXVFrQz6CyGJNh" \
		https://www.pushsafer.com/api
fi
