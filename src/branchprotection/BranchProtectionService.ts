/* eslint-disable @typescript-eslint/no-explicit-any */
import * as core from '@actions/core';
import * as github from '@actions/github';
export class BranchProtectionService {
  public static async getStateOfBranchProtection(): Promise<void> {
    console.log('\n Running branch protection control');

    //numberOfReviewers > 0, if state of branch protection changes
    const numberOfReviewers: number = 0;

    const token: string = core.getInput('github-token');
    const octokit: any = github.getOctokit(token);

    const { owner, repo }: { owner: string; repo: string } = github.context.repo;
    await octokit.rest.repos
      .getBranchProtection({
        owner: owner,
        repo: repo,
        branch: 'main',
      })
      .then((response: any) => {
        console.log(response.data);
      })
      .catch((error: any) => {
        console.log('Branch protections is not enabled for repository: ' + repo);
        console.log('Error:', error?.message);
      });
    core.exportVariable('numberOfReviewers', numberOfReviewers);
  }
}
