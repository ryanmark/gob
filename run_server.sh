#!/bin/sh
exec 2>&1
exec /usr/bin/git daemon --reuseaddr --enable=receive-pack --export-all \
  --base-path=./repos ./repos
