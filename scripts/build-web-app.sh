#!/bin/sh
set -e
####################################################################################
# Build `ui` and `api` together to generate web app
####################################################################################
ROOT_DIR=$(dirname "$(readlink -f "$0")")
cd $ROOT_DIR
source ./utils.sh
sh ./setupEnv.sh

if [ -z "${TARGET_PATH}" ]; then
  # Default TARGET_PATH
  TARGET_PATH="../projects/api"
fi

# Build UI
# sh ./build-ui-to-api.sh

# Build API
print "Build API. Path: $TARGET_PATH"
cd $ROOT_DIR
cd $TARGET_PATH
print "Remove previous build"
rm -rf dist

print "Copy files"
mkdir -p ./dist/src
cp -rf ./prisma ./dist/
cp package.json ./dist/
cp yarn.lock ./dist/
cp -rf ./src/ui ./dist/src/
cp -rf ./src/public ./dist/src/
# remove typescript files
find dist -type f -name "*.ts" -delete

print "Compile Typescript"
npx tsc

# Copy built UI tto build API
print "Install node_modules"
cd ./dist && yarn install --production
