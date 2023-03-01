#!/bin/sh
set -e

function print() {
  # timestamp=$(date +'%Y-%m-%d %H:%M:%S')
  timestamp=$(date +'%H:%M:%S')
  echo "[$timestamp][bi] $@"
}
