#!/usr/bin/env bash

git switch master || exit 1
yarn itsbz-onever inc patch
ver=$(yarn -s itsbz-onever get --machine)
git checkout .onever.json
yarn itsbz-onever set "$ver" && yarn itsbz-onever apply
git add ./.onever.json ./package.json
yarn build
git add ./lib/**/*
git commit -m "Upgrade app version to ${ver}"
git tag "$ver"
yarn changelog
git add --ignore-errors -A -f -- README.md
git commit --amend --no-edit
git tag -d "$ver"
git tag "$ver"
git push origin master --progress --tags
npm publish
