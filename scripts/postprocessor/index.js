import { template } from "./headTemplate";
import fs from 'fs';

export function appendConfiguration({ file, outputFolder }) {
    const mdFileContents = fs.readFileSync(file, 'utf8');
    const claims = {};
    const filename = file.split('/').pop();
    fs.writeFileSync(outputFolder + filename, template({ ...claims }, mdFileContents), 'utf8')
}