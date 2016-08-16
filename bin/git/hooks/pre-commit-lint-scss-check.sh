#!/usr/bin/env bash

changed_files="$(././../../get-modified-scss-files.sh)"

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
