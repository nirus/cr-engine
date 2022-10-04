import path, { dirname } from "path";
import { promises as fs } from "fs";
import { globby } from "globby";
import grayMatter from "gray-matter";

(async function () {
  // prepare the dirs
  const srcDir = path.join(process.cwd(), "src");
  const publicDir = path.join(process.cwd(), "public");
  const contentDir = path.join(srcDir, "pages", "posts");
  const contentFilePattern = path.join(contentDir, "**/*.md");
  const indexFile = path.join(publicDir, "search-index.json");
  const getSlugFromPathname = (pathname) => {
    const removeIndexFile = pathname.replace('index.md', '')
    return path.basename(removeIndexFile);
  }

  const contentFilePaths = await globby([contentFilePattern]);

  if (contentFilePaths.length) {
    const files = contentFilePaths.map(
      async (filePath) => ({ contents: await fs.readFile(filePath, "utf8"), claim: await fs.readFile(dirname(filePath) + '/claim.json', 'utf8') })
    );
    const index = [];
    let i = 0;
    for await (let file of files) {
      const { title, description, tags } = JSON.parse(file.claim);
      const {
        content,
      } = grayMatter(file.contents);
      index.push({
        slug: getSlugFromPathname(contentFilePaths[i]),
        category: "blog",
        title,
        description,
        tags,
        body: content,
      });
      i++;
    }
    await fs.writeFile(indexFile, JSON.stringify(index));
    console.log(
      `Indexed ${index.length} documents from ${contentDir} to ${indexFile}`
    );
  }
})();
