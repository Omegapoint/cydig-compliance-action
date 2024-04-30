import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import { CodeQLService } from './CodeQLService';

export class SastService {
  public static async getStateOfSastTool(
    nameOfTool: string,
    octokit: Octokit,
    owner: string,
    repo: string
  ): Promise<void> {
    console.log('--- SAST control ---');
    let sast: string = nameOfTool;
    if (process.env.sastTool) {
      sast = process.env.sastTool;
    }
    console.log(`Tool:`, `${sast}`);
    core.exportVariable('sastTool', sast);

    if (!sast || sast === '' || sast === 'name-of-tool') {
      core.warning('SAST Tool is not set!');
      return;
    }

    if (sast.toLowerCase() === 'codeql') {
      await CodeQLService.setCodeQLFindings(octokit, owner, repo);
    }
    console.log();
  }
}
