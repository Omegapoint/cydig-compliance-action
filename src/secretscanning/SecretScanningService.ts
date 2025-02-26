import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import GitHub_Tools from '../types/GitHubTools';
import { GithubSecretScanningService } from './GithubSecretScanningService';

export class SecretScanningService {
    public static async getStateOfExposedSecrets(
        nameOfTool: string,
        octokit: Octokit,
        owner: string,
        repo: string,
    ): Promise<void> {
        console.log('--- Secret Scanning control ---');

        if (nameOfTool === null || nameOfTool === undefined || nameOfTool === 'name-of-tool') {
            core.warning('Secret Scanning Tool is not set! Will continue with GitHub Secret Scanning tool:');
            await GithubSecretScanningService.getStateOfExposedSecrets(octokit, owner, repo);
            return;
        }

        switch (nameOfTool.toLowerCase()) {
            case GitHub_Tools.GitHub_SECRET_SCANNING.toLowerCase():
                await GithubSecretScanningService.getStateOfExposedSecrets(octokit, owner, repo);
                break;
            default:
                core.notice('Given secret scanning tool is not implemented: ' + nameOfTool, {
                    title: 'Number of exposed secrets control failed',
                });
                core.exportVariable('secretScanningTool', nameOfTool);
                break;
        }

        console.log();
    }
}
