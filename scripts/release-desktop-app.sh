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
cd $ROOT_DIR
sh ./setupEnv.sh
