#!/bin/sh

regex="(.+\.scss)"
scss_files=""

for f in `git diff --stat --cached origin/master`
do
  if [[ $f =~ $regex ]]
  then
    scss_files+=$f
    scss_files+=" "
  fi
done

echo $scss_files
