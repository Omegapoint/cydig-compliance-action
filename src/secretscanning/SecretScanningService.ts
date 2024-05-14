import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import GitHub_Tools from '../types/GitHubTools';
import { GithubSecretScanningService } from './GithubSecretScanningService';

export class SecretScanningService {
  public static async getStateOfExposedSecrets(nameOfTool: string, octokit: Octokit, owner: string, repo: string): Promise<void> {

    if(nameOfTool === null || nameOfTool === 'name-of-tool'){
      core.warning('Secret Scanning Tool is not set!');
    }

    switch (nameOfTool.toLowerCase()){
      case GitHub_Tools.GitHub_SECRET_SCANNING.toLowerCase():
        GithubSecretScanningService.getStateOfExposedSecrets(octokit, owner, repo);
      default:
        core.notice("Given secret scanning tool is not given")
        core.exportVariable('secretScanningTool', nameOfTool);
    }

    console.log();

  }
}
