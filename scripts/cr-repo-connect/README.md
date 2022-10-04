## About

This script helps to pull the [publication repo](https://github.com/nirus/coder-rocks) to the 'src/pages/post' folder

## Usage 

From the working directory execute below commands

```console
chmod +x scripts/cr-repo-connect/build.sh
scripts/cr-repo-connect/build.sh 
```

To explicitly pull different branch from [publication repo](https://github.com/nirus/coder-rocks) pass the branch name in cmd line,
for example `origin/pub-format` as below.

```console
scripts/cr-repo-connect/build.sh pub-format
```

## finally to link the repo

Run the npm script to link the publication repo to 'cr-engine' with below cmd line from the project working folder

```console
npm run pub-code:link
# or
yarn pub-code:link
```