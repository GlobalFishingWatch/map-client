#!/usr/bin/env bash

BASEDIR=$(dirname "$0")

changed_files="$($BASEDIR/../../get-modified-scss-files.sh)"

if [[ -z $changed_files ]]; then
  echo ""
	echo "================= Checking SCSS Lint ====================="
	echo ""
	npm run lint-sass changed_files
else
  echo ""
	echo "================= No SCSS  files changed ====================="
	echo ""
fi
