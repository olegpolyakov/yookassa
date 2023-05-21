#!/usr/bin/env bash

git switch master || exit 1
node index.js inc patch
ver=$(node index.js get --machine)
git checkout .onever.json
node index.js set "$ver" && node index.js apply
git add ./.onever.json ./package.json
git commit -m "Upgrade app version"
git tag "$ver"
yarn changelog
git add --ignore-errors -A -f -- README.md
git commit --amend --no-edit
git tag -d "$ver"
git tag "$ver"
git push origin master --progress --tags
npm publish
