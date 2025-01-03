#!/usr/bin/env bash

set -o errexit   # abort on nonzero exitstatus
set -o nounset   # abort on unbound variable
set -o pipefail  # don't hide errors within pipes

readonly PROGNAME=$(basename $0) # File name
readonly PROGBASENAME=${PROGNAME%.*} # File name, without the extension
readonly PROGDIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) # File directory
readonly ARGS="$@" # Arguments
readonly ARGNUM="$#" # Arguments number

status=$(cat /volume1/web/webhook.status  | tr -d '\n')
if [[ $status != 1 ]]; then
	printf "Webhook not fired\n"
	exit 0
fi

printf "Updating webhook.status\n"
echo '0' > '/volume1/web/webhook.status'

printf "Killing any ci.sh\n"
pkill -f ci.sh ||

printf "Running CI"
bash /volume1/homes/finn/CI/blog/bin/ci.sh --retry --nonotify > "/volume1/homes/finn/CI/blog-logfile-$(date +'%Y-%m-%d').log" 2>&1
