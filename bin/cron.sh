#!/usr/bin/env bash

set -o errexit   # abort on nonzero exitstatus
set -o nounset   # abort on unbound variable
set -o pipefail  # don't hide errors within pipes

readonly PROGNAME=$(basename $0) # File name
readonly PROGBASENAME=${PROGNAME%.*} # File name, without the extension
readonly PROGDIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) # File directory
readonly ARGS="$@" # Arguments
readonly ARGNUM="$#" # Arguments number

status=$(cat /volume1/web/webhook.status  | tr -s '\n' '')
if [[ "$status" != "1" ]]; then
	exit 1
fi

pkill -f ci.sh

bash /volume1/ContinuousIntegration/blog/bin/ci.sh --retry

echo '0' > '/volume1/web/webhook.status'
