/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as core from '@actions/core';
import * as github from '@actions/github';
export class BranchProtectionService {
  public static async getStateOfBranchProtection(): Promise<void> {
    try {
      console.log('\n Running branch protection control');
      const { owner, repo }: { owner: string; repo: string } = github.context.repo;
      const token: string = core.getInput('PAT-token');

      const octokit = github.getOctokit(token);
      const response = await octokit.rest.repos.getBranchProtection({
        owner,
        repo,
        branch: 'main',
      });

      if (response.data.enforce_admins?.enabled === false) {
        core.warning('Branch protection can be overridden by admins and is therefore counted as not enabled');
      }

      let numberOfReviewers: number = 0;

      if (
        response.data.enforce_admins?.enabled === true &&
        response.data.required_pull_request_reviews?.required_approving_review_count
      ) {
        numberOfReviewers = response.data.required_pull_request_reviews?.required_approving_review_count;
        console.log('Branch protection is enabled, number of reviewers:', numberOfReviewers);
      } else {
        console.log('Branch protection is not enabled for repository:', repo);
      }

      core.exportVariable('numberOfReviewers', numberOfReviewers);
    } catch (error) {
      core.warning('Error getting branch protection!');
      console.log('Error:', error.message);
      if (error.status === 403) {
        core.exportVariable('numberOfReviewers', 0);
      }
    }
  }
}
