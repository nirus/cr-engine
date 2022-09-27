import { dirname } from 'path';
import { rehypeFigure } from './reHypeFigure.mjs';

/**
 *  Adds <figure /> with <figcaption /> tag to the images referenced in markdown files
 */
export function transformCustomTag() {
    return function (tree, file) {
        const inputFolder = dirname(file.history[0]);
        if (inputFolder.includes('src/pages/posts')) {
            const figurine = rehypeFigure({ className: 'cr-figure' });
            figurine(tree);
        }
    }
}