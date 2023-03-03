#!/bin/sh
set -e

####################################################################################
# Build browser extension and desktop-app
####################################################################################

ROOT_DIR=$(dirname "$(readlink -f "$0")")
cd $ROOT_DIR
source ./utils.sh

if [ -z "${TARGET_PATH}" ]; then
  # Default TARGET_PATH
  TARGET_PATH="../projects/desktop-app"
fi

cd $TARGET_PATH
print "desktop-app path: $(pwd)"
mkdir -p ./out/installer
npm run app:make

ls -all .
print "out folder"
ls -R ./out

npm run copy-make-files
