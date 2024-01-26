#!/bin/sh
set -e
####################################################################################
# Build `ui` and `api` together to generate web app
####################################################################################
ROOT_DIR=$(dirname "$(readlink -f "$0")")
cd $ROOT_DIR
source ./utils.sh

if [ -z "${TARGET_PATH}" ]; then
  # Default TARGET_PATH
  TARGET_PATH="../projects/api"
fi

# Build UI
bash ./build-ui-to-api.sh

# Build API
print "Build API. Path: $TARGET_PATH"
cd $ROOT_DIR
cd $TARGET_PATH
print "Remove previous build"
rm -rf dist

bash ${ROOT_DIR}/copy-libs.sh
bash ${ROOT_DIR}/copy-meilisearch-to-api.sh

print "Compile Typescript"
npm run prisma:generate
npx tsc

print "Copy files"
mkdir -p ./dist/src
cp -rf ./prisma ./dist/
cp package.json ./dist/
cp yarn.lock ./dist/
cp -rf ./src/ui ./dist/src/
cp -rf ./src/public ./dist/src/
cp -rf ./src/forkRepos ./dist/src/
cp -rf ./src/db/seedData/files ./dist/src/db/seedData/
cp -rf ./src/searchEngine/meilisearch_bin* ./dist/src/searchEngine/
# remove typescript files
# find dist -type f -name "*.ts" -delete

# Install node_modules
print "Install node_modules"
cd ./dist && yarn install --production
npm run prisma:generate
