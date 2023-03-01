#!/bin/sh
set -e

####################################################################################
# Build browser extension and desktop-app
####################################################################################
ROOT_DIR=$(dirname "$(readlink -f "$0")")
cd $ROOT_DIR
source ./utils.sh
print "Root Folder: $ROOT_DIR"

# Setup env
print "$(date +%Y-%m-%d_%H-%M-%S)"
cd $ROOT_DIR
sh ./setupEnv.sh
