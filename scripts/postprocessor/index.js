import { template } from "./headTemplate";
import fs from 'fs';

const targetFolder = '../src/pages/posts';

export function appendConfiguration({ file, outputFolder = targetFolder }) {
    const mdFileContents = fs.readFileSync(file, 'utf8');
    const claims = {};
    const filename = file.split('/').pop();
    fs.writeFileSync(outputFolder + filename, template({ ...claims }, mdFileContents), 'utf8')
}