#!/usr/bin/env bash

git switch master || exit 1
yarn itsbz-onever inc patch
ver=$(node index.js get --machine)
git checkout .onever.json
yarn itsbz-onever set "$ver" && yarn itsbz-onever apply
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
