#!/bin/sh
set -e

function print() {
  # timestamp=$(date +'%Y-%m-%d %H:%M:%S')
  timestamp=$(date +'%H:%M:%S')
  echo "[$timestamp][bitsky] $@"
}

function copyAllFilesWithExtension() {
  print "Files with extesion $2 in path $1"
  print $(find $1 -type f -name $2)
  find $1 -type f -name $2 -exec cp {} $3 \;
}
