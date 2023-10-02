/* eslint-disable @typescript-eslint/no-explicit-any */
import * as core from '@actions/core';
import * as github from '@actions/github';
export class BranchProtectionService {
  public static async getStateOfBranchProtection(): Promise<void> {
    console.log('\n Running branch protection control');

    const { owner, repo }: { owner: string; repo: string } = github.context.repo;
    const token: string = core.getInput('PAT-token');
    // eslint-disable-next-line @typescript-eslint/typedef
    const octokit = github.getOctokit(token);
    let numberOfReviewers: number = 0;
    await octokit.rest.repos
      .getBranchProtection({
        owner: owner,
        repo: repo,
        branch: 'main',
      })
      .then((response: any) => {
        console.log('Response', response.data);
        if (!response.data.enforce_admins?.enabled) {
          console.log('Branch protection can be overridden by admins, and is therefore counted as not enabled');
          return;
        }
        if (response.data.required_pull_request_reviews?.['required_approving_review_count'] >= 1) {
          numberOfReviewers = response.data.required_pull_request_reviews?.['required_approving_review_count'];
          console.log('Branch protection is enabled, number of reviewers are:', numberOfReviewers);
        }
      })
      .catch((error: any) => {
        console.log('Error:', error?.message);
      });
    if (numberOfReviewers <= 0) console.log('Branch protections is not enabled for repository: ' + repo);
    core.exportVariable('numberOfReviewers', numberOfReviewers);
  }
}
