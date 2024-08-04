<h1 align="center">Cryogen Framework</h1>

<p align="center">powers the https://coder.rocks</p>


### Points to remember
- `posts/**/hero.jpg` or `posts/**/hero.png` is hardcoded as a legend images to each posts.  User need to upload the images as `hero.jpg` or `hero.png` to be legend image to the post. The files are picked automatically by build script.
- Images used in image markdown is relative to the `posts` folder. So please `./` while refering in image tag.
- PR that needs no trigger of github actions please add `[skip actions]` to the head of your pull requests. Check this [documentation](https://docs.github.com/en/actions/managing-workflow-runs/skipping-workflow-runs).
- Github actions are run only on `demo/**` or `main` branches. For `demo/**` branch a preview URL is generated. Check the workflow log printed by cloudflare. 
