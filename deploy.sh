#!/usr/bin/env sh

set -e
npm run build
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:ivandata/another-way-to-create-themes.git master:gh-pages
cd -
