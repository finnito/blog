#!/usr/bin/env bash
set -e

git submodule update --remote
rm -rf public/
hugo --buildDrafts --config config-dev.toml