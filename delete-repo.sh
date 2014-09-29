#!/bin/bash

if [ -z "$1" ]; then
  echo "No argument supplied"
  exit 1
fi

repo_name=$1
repo_path=repos/$repo_name.git
repo_data_path=repos/$repo_name.json
working_path=working/$repo_name
trash_dir="deleted"

if [ ! -d $trash_dir ]; then
  mkdir $trash_dir
fi

if [ -d $working_path ]; then
  rm -rf $working_path
fi

if [ -d $repo_path ];
then
  stamp=`date '+%s'`
  mv $repo_path $trash_dir/$stamp-$repo_name.git
  mv $repo_data_path $trash_dir/$stamp-$repo_name.json
fi
