#!/bin//sh
set -e
TARGET_PATH=${PWD}

ROOT_DIR=$(dirname "$(readlink -f "$0")")
cd $ROOT_DIR
source ./utils.sh

rm -rf ${TARGET_PATH}/src/bitskyLibs/shared
mkdir -p ${TARGET_PATH}/src/bitskyLibs/shared
cp -rf ../projects/shared "${TARGET_PATH}/src/bitskyLibs/"

print "Copied 'shared' folder to ${TARGET_PATH}/src/bitskyLibs/shared"
