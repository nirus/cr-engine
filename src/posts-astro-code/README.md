### Read below

- Any astro code inside 'posts-astro-code' that should always make absolute imports to prevent errors (check - [....page].astro).

This folder contains the astro script that manages 'src/pages/posts'. Build script from 'scripts/cr-repo-connect/build.sh' pulls the coder-rocks repo 'origin/publish' branch and 'scripts/symlink-repo' symlinks the scripts to 'posts' folder.

Any change to astro code in 'src/pages/posts' will be reflected and git tracked in 'src/posts-astro-code'. 'src/pages/posts' is ignored during the commit using '.gitignore' entry. We dont need multiple copies every where.

If you need to change any article make PR to https://github.com/nirus/coder-rocks

If you need to pull the code from 'coder-rocks' repo. Use 'git hard reset' to always point to head revision from the publication repo.

Happy coding!
