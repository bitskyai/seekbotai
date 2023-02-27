#!/bin/sh
set -e

rm -rf dist

mkdir -p dist/prisma
cp -rf prisma/* dist/prisma/
npx tsc

cp package.json dist/
find dist/prisma -type f -name "*.ts" -delete
cd dist
npm install --omit=dev
