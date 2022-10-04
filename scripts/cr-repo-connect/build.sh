#!/bin/bash

branch=$1

git clone --no-checkout https://github.com/nirus/coder-rocks.git src/pages/posts

git --git-dir=src/pages/posts/.git --work-tree=src/pages/posts sparse-checkout init --cone

rm -rf src/pages/posts/.git/info/sparse-checkout

touch src/pages/posts/.git/info/sparse-checkout

echo "/* \n!README.md" >> src/pages/posts/.git/info/sparse-checkout
cd src/pages/posts/

echo "\n ********** [GIT script starts] *********** \n"
echo "$PWD\n"

if [[ -n "$branch" ]]; then
    git checkout $branch
else
    git checkout publish
fi
