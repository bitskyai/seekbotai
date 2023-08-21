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
VPNAME="meilisearch_bin_1_3_1"
# Copy MeiliSearch to the API
print "Copy MeiliSearch to the API"
mv ${ROOT_DIR}/$PNAME ${ROOT_DIR}/$VPNAME
rm -rf ${TARGET_PATH}/src/searchEngine/${PNAME}*
cp -rf ${ROOT_DIR}/$VPNAME ${TARGET_PATH}/src/searchEngine/
