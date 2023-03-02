#!/bin/sh
set -e

####################################################################################
# Build web-app, then copy to desktop-app
####################################################################################

ROOT_DIR=$(dirname "$(readlink -f "$0")")
cd $ROOT_DIR
source ./utils.sh
sh ./setupEnv.sh

if [ -z "${TARGET_PATH}" ]; then
  # Default TARGET_PATH
  TARGET_PATH="../projects/desktop-app"
fi

if [ -z "${WEB_APP_PATH}" ]; then
  # Default WEB_APP_PATH
  WEB_APP_PATH="../projects/api/dist"
fi

# Build web app
print "Build web app"
sh ./build-web-app.sh

print "Remove previous web-app"
cd $TARGET_PATH
rm -rf ./dist/web-app
rm -rf ./src/web-app

# Copy web app
print "Copy web-app"
cd $ROOT_DIR
mkdir -p $TARGET_PATH/src/web-app/ && cp -rf $WEB_APP_PATH/* $TARGET_PATH/src/web-app/
