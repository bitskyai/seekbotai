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
print "Remove previous out"
rm -rf ./out
print "desktop-app path: $(pwd)"
mkdir -p ./out/installer
npm run app:make

if [[ "$(uname)" == "Linux" ]]; then
  print "Operating system is Linux"
  copyAllFilesWithExtension ./out/make "*.deb" ./out/installer/
  copyAllFilesWithExtension ./out/make "*.rpm" ./out/installer/
  zip -r ./out/bitsky.zip ./out/installer
# Check if the operating system is macOS
elif [[ "$(uname)" == "Darwin" ]]; then
  print "Operating system is macOS"
  copyAllFilesWithExtension ./out/make "*.zip" ./out/
  mv -f ./out/bitsky-*.zip ./out/bitsky.zip
# Check if the operating system is Windows (using MSYS2)
elif [[ "$(uname -o)" == "Msys" ]]; then
  print "Operating system is Windows"
  copyAllFilesWithExtension ./out/make "*.exe" ./out/installer/
  copyAllFilesWithExtension ./out/make "*.nupkg" ./out/installer/
  ls -all ./out/installer
  cd ./out/installer
  compact /c /s *.*

  ls -all .
  ls -all ../

  cd $ROOT_DIR
  cd $TARGET_PATH
  mv -f .out/installer/*.zip ./bitsky.zip
  # Compress-Archive -Path ./out/installer/* -DestinationPath "./out/bitsky.zip"
else
  print "Unknown operating system"
fi
