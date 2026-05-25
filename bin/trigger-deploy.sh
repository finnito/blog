#!/usr/bin/env bash

set -o errexit  # abort on nonzero exitstatus
set -o nounset  # abort on unbound variable
set -o pipefail # don't hide errors within pipes

printf "\e[32m[SSH\'ing to mothership]\e[0m\n"
ssh -p29163 finn@mothership <<'EOF'
  cd ~/CI/blog2
  git pull
EOF

printf "\n"

printf "\e[32m[Clearing Cloudflare cache for / and /index.xml]\e[0m\n"
curl https://api.cloudflare.com/client/v4/zones/a3e485bd7576a69f697fa9a568e878cc/purge_cache \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN_CACHE" \
  -d '{
        "files": [
          "https://finn.lesueur.nz",
          "https://finn.lesueur.nz/index.xml"
        ]
      }'
