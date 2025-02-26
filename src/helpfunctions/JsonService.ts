import * as fs from 'fs';
import * as path from 'path';
import { CyDigConfig } from '../types/CyDigConfig';

export function getContentOfFile(jsonPath: string): CyDigConfig {
    const jsonFilePath: string = path.resolve(
        __dirname,
        path.relative(__dirname, path.normalize(jsonPath).replace(/^(\.\.(\/|\\|$))+/, '')),
    );
    const fileContent: string = fs.readFileSync(jsonFilePath, { encoding: 'utf-8' });

    const cydigConfig: CyDigConfig = JSON.parse(fileContent);

    return cydigConfig;
}
