#!/bin/sh
set -e
####################################################################################
# Build `ui` to `api` folder
####################################################################################
ROOT_DIR=$(dirname "$(readlink -f "$0")")
cd $ROOT_DIR
source ./utils.sh
bash ./setupEnv.sh

if [ -z "${TARGET_PATH}" ]; then
  # Default TARGET_PATH
  TARGET_PATH="../projects/api"
fi

if [ -z "${UI_PATH}" ]; then
  # Default UI_PATH
  UI_PATH="../projects/ui"
fi

# Remove previous build
cd $ROOT_DIR
print "Remove previous build"
print "TARGET_PATH: $TARGET_PATH/src/ui"
rm -rf $TARGET_PATH/src/ui

# Build UI
print "Build UI. Path: $UI_PATH"
cd $UI_PATH
yarn build

cd $ROOT_DIR
mkdir -p $TARGET_PATH/src/ui/ && cp -rf $UI_PATH/dist/* $TARGET_PATH/src/ui/
