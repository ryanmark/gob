#!/bin/bash

branch=master

repo_name=$1
repo_path=repos/$repo_name.git
working_path=working/$repo_name

if [ ! -d $working_path ]; then
  git clone $repo_path $working_path
fi

pushd $working_path
git fetch origin
git reset --hard origin/$branch
git submodule update --init

if [ ! -f "build.sh" ]; then
  echo 'App is missing build.sh'
  exit 1
fi

exec ./build.sh "$2" "$3"
