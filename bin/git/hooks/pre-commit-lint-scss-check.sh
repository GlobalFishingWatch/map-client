#!/usr/bin/env bash

BASEDIR=$(dirname "$0")

changed_files="$($BASEDIR/../../get-modified-scss-files.sh)"

if [[ -z $changed_files ]]; then
  echo ""
	echo "================= No SCSS  files changed ====================="
	echo ""
else
  echo ""
	echo "================= Checking SCSS Lint ====================="
	echo $changed_files
	echo ""
	npm run lint-sass changed_files
fi
