#!/bin/bash

if [ -z "$1" ]; then
  echo "No argument supplied"
  exit 1
fi

repo_name=$1
repo_path=repos/$repo_name.git

if [ -d $repo_path ]; then
  echo "Repo exists"
  exit 1
fi

mkdir -p $repo_path
pushd $repo_path
git init --bare --shared
git config receive.denyNonFastForwards false
popd
ln -s `pwd`/hooks/post-receive $repo_path/hooks
