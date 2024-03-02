#!/bin/sh
set -e

####################################################################################
# Build Desktop app
####################################################################################

ROOT_DIR=$(dirname "$(readlink -f "$0")")
cd $ROOT_DIR
source ./utils.sh

if [ -z "${TARGET_PATH}" ]; then
  # Default TARGET_PATH
  TARGET_PATH="../projects/desktop-app"
fi

# Build web app to desktop app
print "Build web app to desktop app"
bash ./build-web-app-to-desktop-app.sh

cd $TARGET_PATH
print "Remove previous build"
rm -rf ./dist
rm -rf ./out

bash ${ROOT_DIR}/copy-libs.sh

# Build desktop app UI
print "Build desktop app UI"
npm run build:ui

print "Complie Typescript"
npm run tsc

print "Copy files to dist"
cp -rf ./src/web-app ./dist/
cp -rf ./src/ui ./dist/
cp package.json ./dist
cp yarn.lock ./dist

print "Install node_modules in dist"
cd ./dist
yarn install --prod
