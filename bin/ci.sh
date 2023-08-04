#!/usr/bin/env bash

set -o errexit   # abort on nonzero exitstatus
set -o nounset   # abort on unbound variable
set -o pipefail  # don't hide errors within pipes

_START=$(date +%s)

readonly PROGNAME=$(basename $0) # File name
readonly PROGBASENAME=${PROGNAME%.*} # File name, without the extension
readonly PROGDIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) # File directory
readonly ARGS="$@" # Arguments
readonly ARGNUM="$#" # Arguments number

OUTPUTDIR="/volume1/web/finn.lesueur.nz/"

RETRY=false
NOTIFY=true
DEPLOY=true

on_error(){
	echo "Error: ($1) occurred on $2"
	cat "/volume1/homes/finn/CI/blog-logfile-$(date +'%Y-%m-%d').log" | ssmtp finn.lesueur@gmail.com
}
trap 'on_error $? $LINENO' ERR

help(){
	printf "Usage: ./ci.sh --retry
Options
	-d, --nodeploy	: Does not rsync the files to VPS.
	-n, --nonotify	: Does not send Pushsafer notification.
	-r, --retry		: Runs the CI without requiring different
                    local and remote hashes.
"
}

while [ "$#" -gt 0 ]
do
	case "$1" in
	-h|--help)
		help
		exit 0
		;;
	-r|--retry)
		RETRY=true
		shift
		;;
	-n|--nonotify)
		NOTIFY=false
		shift
		;;
	-d|--nodeploy)
		DEPLOY=false
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
done

cd "/volume1/homes/finn/CI/blog"

printf "Subject: Blog Build Output\n\n"
printf "[$(date +'%T')]: Fetching git\n"
git fetch

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
	./bin/parse_gpx.py

	# Build site with Hugo
	printf "[$(date +'%T')]: Building Hugo\n"
	./bin/hugo \
		--config="config.toml" \
		--quiet \
		--destination="$OUTPUTDIR"

	if [[ "$RETRY" == true ]]; then
		# Sync build to server
		printf "[$(date +'%T')]: Rsync to VPS\n"
		rsync \
			--archive \
			--compress \
			--delete \
			--chown=www-data:www-data \
			--rsh="ssh -p29163" \
			"$OUTPUTDIR" \
			root@172.105.169.195:/srv/finn.lesueur.nz/
	fi

	# Leave Python3 venv
	printf "[$(date +'%T')]: Deactivating venv\n"
	deactivate

	_DURATION=$[$(date +%s) - $_START]
	_SEC=$(($_DURATION%60))
	_MIN=$(($_DURATION/60))
	printf "[$(date +'%T')]: Duration ${_MIN}:${_SEC}min\n"

	find /volume1/homes/finn/CI/*.log | sort --reverse | awk "NR>5" | xargs --no-run-if-empty rm -r

	cat "/volume1/homes/finn/CI/blog-logfile-$(date +'%Y-%m-%d').log" | ssmtp finn.lesueur@gmail.com
fi
