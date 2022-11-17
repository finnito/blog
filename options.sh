#!/usr/bin/env bash

readonly PROGNAME=$(basename $0) # File name
readonly PROGBASENAME=${PROGNAME%.*} # File name, without the extension
readonly PROGDIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) # File directory
readonly ARGS="$@" # Arguments
readonly ARGNUM="$#" # Arguments number

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

echo "$RETRY"

localHash=$(cat .git/refs/heads/master)
remoteHash=$(cat .git/refs/remotes/origin/master)

printf "[$(date +'%T')]: Comparing Hashes\n    Local  Hash: $localHash\n    Remote Hash: $remoteHash\n"

if [[ "$localHash" != "$remoteHash" ]] || [[ "$RETRY" == true ]]; then
	echo "Building!"
fi
