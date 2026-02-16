# Plugins

Custom Astro/rehype plugins registered in `astro.config.mjs`.

## TransformCustomTags/

**`index.mjs`** — Astro markdown plugin that wraps post images with `<figure>` + `<figcaption>`.
Applies to posts in `src/content/posts/`.

**`reHypeFigure.mjs`** — rehype transformer using `unist-util-visit` + `hastscript`.
Supports JSON-like alt text for captions:

```markdown
![{ caption: "Description", width: "500px" }](./image.png)
```

Outputs:
```html
<figure class="cr-figure">
  <img src="./image.png" />
  <figcaption>Description</figcaption>
</figure>
```

## Tests

`plugins/**/*.test.mjs` — included in Vitest config.
