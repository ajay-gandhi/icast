#!/bin/bash
electron-packager ./ --overwrite --platform=darwin --prune=true --out=release --ignore="build.sh"
cp icons/logo.icns release/iCast-darwin-x64/iCast.app/Contents/Resources/app/icons/
cp icons/logo.icns release/iCast-darwin-x64/iCast.app/Contents/Resources/electron.icns

