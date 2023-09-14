import * as core from '@actions/core';
import * as github from '@actions/github';
export class BranchProtectionService {
  public static async getStateOfBranchProtection(): Promise<void> {
    console.log('\n Running branch protection control');
    
    //numberOfReviewers > 0, if state of branch protection changes
    let numberOfReviewers: number = 0;

    const token = core.getInput('repo-token');
    const octokit = github.getOctokit(token);

    const { owner, repo } = github.context.repo;
    await octokit.rest.repos
      .getBranchProtection({
        owner: owner,
        repo: repo,
        branch: 'main',
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log('Branch protections is not enabled for repository: ' + repo)
      });
      core.exportVariable('numberOfReviewers', numberOfReviewers)
  }
}
