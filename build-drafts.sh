#!/usr/bin/env bash
set -e

rm -rf public/
hugo--buildDrafts --buildFuture --buildExpired