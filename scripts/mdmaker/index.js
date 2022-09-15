import { template } from "./head.mjs";
import fs from 'fs';
import { extname, resolve } from 'path';

/**
 * Configuration area
 */
const postsFolder = resolve('../..', 'src/pages/posts/');
const restrictedFiles = ["claim.json"];

/**
 * appends the header for the markdown file to be post processed by 
 * Astro build command
 * @param {*} inputFolder folder to process
 */
export function appendConfiguration(inputFolder, author = 'nirus') {

    const sourceFolderName = inputFolder.split('/').pop();

    const targetFolder = resolve(postsFolder + '/' + sourceFolderName);

    fs.mkdirSync(targetFolder, { recursive: true });
    const claimFile = resolve(inputFolder + '/claim.json');
    const claim = JSON.parse(fs.readFileSync(claimFile, 'utf8'));

    const folderContents = fs.readdirSync(inputFolder);

    for (const file of folderContents) {
        const filename = file.split('/').pop();

        //Don't process the restricted files
        if (restrictedFiles.includes(filename)) { continue; }

        const inputFile = inputFolder + '/' + file;

        if (extname(filename) === '.md') {
            const mdContents = fs.readFileSync(inputFile, 'utf8');
            fs.writeFileSync(targetFolder + '/' + filename, template({ ...claim, author }, mdContents), 'utf8')
        } else {
            fs.copyFileSync(inputFile, targetFolder + '/' + filename);
        }

    }
}