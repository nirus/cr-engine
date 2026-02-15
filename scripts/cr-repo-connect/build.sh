#!/bin/bash

branch=$1

git clone --no-checkout https://github.com/nirus/coder-rocks.git src/content/posts

git --git-dir=src/content/posts/.git --work-tree=src/content/posts sparse-checkout init --cone

rm -rf src/content/posts/.git/info/sparse-checkout

touch src/content/posts/.git/info/sparse-checkout

echo "/* \n!README.md" >> src/content/posts/.git/info/sparse-checkout

if [[ -n "$branch" ]]; then
    git --git-dir=src/content/posts/.git --work-tree=src/content/posts checkout $branch
else
    git --git-dir=src/content/posts/.git --work-tree=src/content/posts checkout publish
fi
