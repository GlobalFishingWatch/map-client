#!/bin/sh

scss_files=""

for f in `git diff --cached --name-only --diff-filter=ACM | grep -v node_modules | grep '\.scss$'`
do
  scss_files+=$f
  scss_files+=" "
done

echo $scss_files
