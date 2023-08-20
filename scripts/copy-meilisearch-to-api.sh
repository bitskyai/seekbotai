#!/bin/sh
set -e
ROOT_DIR=$(dirname "$(readlink -f "$0")")
cd $ROOT_DIR
source ./utils.sh

source ./download-meilisearch.sh

if [ -z "${TARGET_PATH}" ]; then
  # Default TARGET_PATH
  TARGET_PATH="../projects/api"
fi

rm -rf ${ROOT_DIR}/$PNAME*

# Download MeiliSearch
latest="v1.3.1"
main

# Copy MeiliSearch to the API
print "Copy MeiliSearch to the API"
rm -rf ${TARGET_PATH}/src/searchEngine/${PNAME}*
cp -rf ${ROOT_DIR}/$PNAME* ${TARGET_PATH}/src/searchEngine/
