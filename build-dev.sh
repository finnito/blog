#!/usr/bin/env bash
set -e

rm -rf public/
hugo --buildDrafts --config=config-dev.toml