#!/usr/bin/env bash

set -o errexit   # abort on nonzero exitstatus
set -o nounset   # abort on unbound variable
set -o pipefail  # don't hide errors within pipes

readonly PROGNAME=$(basename $0) # File name
readonly PROGBASENAME=${PROGNAME%.*} # File name, without the extension
readonly PROGDIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) # File directory
readonly ARGS="$@" # Arguments
readonly ARGNUM="$#" # Arguments number

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

RETRY=false

while [ "$#" -gt 0 ]
do
	case "$1" in
	-h|--help)
		usage
		exit 0
		;;
	-r|--retry)
		RETRY=true
		shift
		;;
	--)
		break
		;;
	-*)
		echo "Invalid option '$1'. Use --help to see the valid options" >&2
		exit 1
		;;
	# an option argument, continue
	*)	;;
	esac
	shift
done

cd "$HOME/CI/blog"

printf "[$(date +'%T')]: Fetching git\n"
git fetch --quiet

localHash=$(cat .git/refs/heads/master)
remoteHash=$(cat .git/refs/remotes/origin/master)

# printf "=== Comparing ===\nLocal  Hash: %s\nRemote Hash: %s\n" "$localHash" "$remoteHash"

if [[ "$localHash" != "$remoteHash" ]] || [[ "$RETRY" == true ]]; then
	# Enter Python3 venv
	printf "[$(date +'%T')]: Activating venv\n"
	source venv/bin/activate

	# CI is behind master.
	# Get most recent changes then deploy.
	printf "[$(date +'%T')]: Pulling changes\n"
	git pull origin master --quiet
	
	# Rebuild gpx-->json data files
	printf "[$(date +'%T')]: Running parse_gpx.py\n"
	python3 parse_gpx.py

	# Build site with Hugo
	printf "[$(date +'%T')]: Building Hugo\n"
	./hugo \
		--config="config.toml" \
		--quiet
		--destination="/volume1/homes/finn/CI/blog-build/"

	# Sync build to server
	printf "[$(date +'%T')]: Rsync tp VPS\n"
	rsync \
		--archive \
		--compress \
		--delete \
		--stats \
		--chown=www-data:www-data \
		--rsh="ssh -p29163" \
		"/volume1/homes/finn/CI/blog-build/" \
		root@172.105.169.195:/srv/finn.lesueur.nz/

	# Leave Python3 venv
	printf "[$(date +'%T')]: Deactivating venv"
	deactivate

	# Send success notification to phone
	message=$(cat "/volume1/homes/finn/CI/blog-logfile-$(date +'%Y-%m-%d').log")
	curl \
		--silent \
		--form-string "t=Blog Rebuilt" \
		--form-string "m=$message" \
		--form-string "d=59496" \
		--form-string "k=pd0cruRXVFrQz6CyGJNh" \
		https://www.pushsafer.com/api
fi
