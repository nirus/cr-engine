#!/bin/bash

git clone --no-checkout https://github.com/nirus/coder-rocks.git src/pages/posts

git --git-dir=src/pages/posts/.git --work-tree=src/pages/posts sparse-checkout init --cone

rm -rf src/pages/posts/.git/info/sparse-checkout

touch src/pages/posts/.git/info/sparse-checkout

echo -e "/* \n!README.md" >> src/pages/posts/.git/info/sparse-checkout

git --git-dir=src/pages/posts/.git --work-tree=src/pages/posts checkout publish



