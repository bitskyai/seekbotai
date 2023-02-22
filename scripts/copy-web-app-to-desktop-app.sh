#!/bin/sh
set -e

ROOT_DIR=$(pwd)
echo "Root Folder: $ROOT_DIR"
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
echo "Script dir: $SCRIPT_DIR"

cd $SCRIPT_DIR

if [ -z "${TARGET_PATH}" ]; then
  # Default TARGET_PATH
  TARGET_PATH="../projects/desktop-app"
fi

if [ -z "${WEB_APP_PATH}" ]; then
  # Default WEB_APP_PATH
  WEB_APP_PATH="../projects/api/dist"
fi

# Build web app
echo ">>>> Build web app"
sh ./build-web-app.sh

# Copy web app
echo ">>>> Copy built web app to desktop app"
mkdir -p $TARGET_PATH/src/web-app/ && cp -rf $WEB_APP_PATH/* $TARGET_PATH/src/web-app/
