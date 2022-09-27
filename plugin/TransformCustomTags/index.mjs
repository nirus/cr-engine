import { dirname } from 'path';
import { rehypeFigure } from './reHypeFigure.mjs';


export function transformCustomTag() {
    return function (tree, file) {
        const inputFolder = dirname(file.history[0]);
        if (inputFolder.includes('src/pages/posts')) {
            // console.log({ tree: JSON.stringify(tree) });
            const figurine = rehypeFigure({ className: 'cr-figure' });
            figurine(tree);
        }
    }
}