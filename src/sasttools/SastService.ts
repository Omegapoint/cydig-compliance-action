import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import { CodeQLService } from './CodeQLService';
import GitHub_Tools from '../types/GitHubTools';

export class SastService {
    public static async getStateOfSastTool(
        nameOfTool: string,
        octokit: Octokit,
        owner: string,
        repo: string,
    ): Promise<void> {
        console.log('--- SAST control ---');
        let sast: string = nameOfTool;
        if (process.env.sastTool) {
            sast = process.env.sastTool;
        }
        if (!sast || sast === '' || sast === 'name-of-tool') {
            core.warning('SAST Tool is not set!');
            return;
        }
        console.log(`Tool:`, `${sast}`);
        switch (sast.toLowerCase()) {
            case GitHub_Tools.CODEQL.toLowerCase():
                await CodeQLService.setCodeQLFindings(sast, octokit, owner, repo);
                break;
            default:
                core.exportVariable('sastTool', sast);
                break;
        }
        console.log();
    }
}
