/* eslint-disable @typescript-eslint/no-explicit-any */
import * as core from '@actions/core';
import * as github from '@actions/github';
export class BranchProtectionService {
  public static async getStateOfBranchProtection(): Promise<void> {
    console.log('\n Running branch protection control');

    const { owner, repo }: { owner: string; repo: string } = github.context.repo;
    const token: string = core.getInput('PAT-token');
    const octokit: any = github.getOctokit(token);

    await octokit.rest.repos
      .getBranchProtection({
        owner: owner,
        repo: repo,
        branch: 'main',
      })
      .then((response: any) => {
        console.log(
          'Branch protection is enabled, number of reviewers are:',
          response.data.required_pull_request_reviews?.['required_approving_review_count']
        );
        core.exportVariable(
          'numberOfReviewers',
          response.data.required_pull_request_reviews?.['required_approving_review_count']
        );
      })
      .catch((error: any) => {
        console.log('Branch protections is not enabled for repository: ' + repo);
        console.log('Error:', error?.message);
      });
  }
}
