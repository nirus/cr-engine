import { visit } from 'unist-util-visit';
import { dirname, basename } from 'path';

/**
 * This plugin fixes the image markdown to point to proper image file while hosted within 'post' folder
 * @returns 
 */
export function postsImagePathFixture() {
    return function (tree, file) {
        const whichFile = file.history[0];
        const isPostDir = whichFile.includes('/src/pages/posts/');
        if (isPostDir) {
            const basePost = basename(dirname(whichFile));
            visit(tree, 'image', function (node) {
                const baseName = basename(node.url);
                const reformedUrl = `/posts/${basePost}/${baseName}`;
                node.url = reformedUrl;
            });
        }
    }

}