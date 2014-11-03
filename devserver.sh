#!/bin/bash

./node_modules/.bin/watchify application.js -o gob/static/app.js -v &

git daemon --reuseaddr --enable=receive-pack --export-all \
  --base-path=./data/repos ./data/repos &

$VIRTUAL_ENV/bin/python application.py &

trap "killtree $$" SIGINT

killtree() {
    local parent=$1 child
    for child in $(ps -o ppid= -o pid= | awk "\$1==$parent {print \$2}"); do
        killtree $child
    done
    kill $parent
}

wait
