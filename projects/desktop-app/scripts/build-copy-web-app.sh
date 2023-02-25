#!/bin/sh

ROOT_DIR=$(pwd)
echo "Root Folder: $ROOT_DIR"

# remove currently web app
rm -rf ./dist/web-app
rm -rf ./src/web-app

# build web-app
bash ../../scripts/copy-web-app-to-desktop-app.sh

cd ${ROOT_DIR}

# copy web-app
mkdir -p ./dist/web-app/ &&
  cp -rf ./src/web-app dist
