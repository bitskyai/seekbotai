#!/bin/sh
set -e

####################################################################################
# Setup environment
####################################################################################

ROOT_DIR=$(dirname "$(readlink -f "$0")")
cd $ROOT_DIR
source ./utils.sh
print "####################################################################################"
print "# Setup environment"
# Setup yarn workspace
print "Install node_modules in yarn workspace"
cd $ROOT_DIR
yarn install --frozen-lockfile

# Setup api
print "Install node_modules in api"
cd $ROOT_DIR
cd ../projects/api
yarn install --frozen-lockfile

# setup desktop-app
print "Install node_modules in desktop-app"
cd $ROOT_DIR
cd ../projects/desktop-app
yarn install --frozen-lockfile
print "####################################################################################\n"
