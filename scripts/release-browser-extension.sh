#!/bin/sh
set -e

####################################################################################
# Build browser extension and desktop-app
####################################################################################
ROOT_DIR=$(dirname "$(readlink -f "$0")")
cd $ROOT_DIR
source ./utils.sh

bash ./build-browser-extension.sh

if [ -z "${TARGET_PATH}" ]; then
  # Default TARGET_PATH
  TARGET_PATH="../projects/browser-extension"
fi

cd $TARGET_PATH
print "Create package"
npm run package

print "Rename zip file to 'chrome-extension-latest.zip'"
mv -f ./build/chrome-*.zip ./build/chrome-extension-latest.zip
