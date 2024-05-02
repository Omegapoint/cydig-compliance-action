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
    console.log(`Tool:`, `${sca}`);
    core.exportVariable('scaTool', sca);

    if (!sca || sca === '' || sca === 'name-of-tool') {
      core.warning('SCA Tool is not set!');
      return;
    }

    if (sca.toLowerCase() === GitHub_Tools.DEPENDABOT.toLowerCase()) {
      await DependabotService.setDependabotFindings(octokit, owner, repo);
    }
    console.log();
  }
}
