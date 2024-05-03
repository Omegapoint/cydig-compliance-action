import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import { DependabotService } from './DependabotService';
import GitHub_Tools from '../types/GitHubTools';

export class ScaService {
  public static async getStateOfScaTool(
    nameOfTool: string,
    octokit: Octokit,
    owner: string,
    repo: string
  ): Promise<void> {
    console.log('--- SCA control ---');
    let sca: string = nameOfTool;
    if (process.env.scaTool) {
      sca = process.env.scaTool;
    }
    if (!sca || sca === '' || sca === 'name-of-tool') {
      core.warning('SCA Tool is not set!');
      return;
    }
    console.log(`Tool:`, `${sca}`);
    switch (sca.toLowerCase()) {
      case GitHub_Tools.DEPENDABOT.toLowerCase():
        await DependabotService.setDependabotFindings(sca, octokit, owner, repo);
        break;
      default:
        core.exportVariable('scaTool', sca);
        break;
    }
    console.log();
  }
}
