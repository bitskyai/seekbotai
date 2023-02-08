#!/bin/sh
set -e
####################################################################################
# Build `ui` and `api` together to generate web app
####################################################################################
ROOT_DIR=$(pwd)
echo "Root Folder: $ROOT_DIR"
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
echo "Script dir: $SCRIPT_DIR"

cd $SCRIPT_DIR

if [ -z "${TARGET_PATH}" ]; then
  # Default TARGET_PATH
  TARGET_PATH="../projects/api"
fi

if [ -z "${UI_PATH}" ]; then
  # Default UI_PATH
  UI_PATH="../projects/ui"
fi

echo ">>>> Build UI"
echo "UI_PATH: ${UI_PATH}"
cd $UI_PATH && yarn build

cd $SCRIPT_DIR
echo ">>>> Remove previous build"
echo "TARGET_PATH: ${TARGET_PATH}"
rm -rf $TARGET_PATH/dist/ui

echo ">>>> Copy new build"
mkdir -p $TARGET_PATH/dist/ui/ && cp -rf $UI_PATH/dist/* $TARGET_PATH/dist/ui/
