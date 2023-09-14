import * as core from '@actions/core';
import * as github from '@actions/github';
export class BranchProtectionService {
  public static async getStateOfBranchProtection(): Promise<void> {
    console.log('\n Running branch protection control');
    const token = core.getInput('repo-token');
    //console.log('Got the token');

    const octokit = github.getOctokit(token);
    //console.log('octoKit authenticated');

    const { owner, repo } = github.context.repo;
    //console.log(`Owner: ${owner}`);
    //console.log(`Repo: ${repo}`);

    //console.log('Going to get branch protection');
    await octokit.rest.repos
      .getBranchProtection({
        owner: owner,
        repo: repo,
        branch: 'main',
      })
      .then((response) => {
        //console.log('Got the branch protection');
        console.log(response.data);
      })
      .catch((error) => {
        console.log('Branch protections is not enabled for repository: ' + repo)
        //core.warning('Error getting branch protection!');
        //console.log('Error: ', error.message);
      });
  }
}
