/* eslint-disable @typescript-eslint/no-explicit-any */
import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/action';
export class BranchProtectionService {
  public static async getStateOfBranchProtection(): Promise<void> {
    console.log('\n Running branch protection control');

    // const octokit: Octokit = new Octokit();
    const { owner, repo }: { owner: string; repo: string } = github.context.repo;
    // octokit.repos
    //   .getBranchProtection({
    //     owner: owner,
    //     repo: repo,
    //     branch: 'main',
    //   })
    //   .then((response: any) => {
    //     console.log(
    //       'Branch protection is enabled, and reviewers needed are:',
    //       response.data.required_approving_review_count
    //     );
    //     console.log(response.data);
    //   })
    //   .catch((error: any) => {
    //     console.log('Branch protections is not enabled for repository: ' + repo);
    //     console.log('Error:', error?.message);
    //   });

    //numberOfReviewers > 0, if state of branch protection changes
    const numberOfReviewers: number = 0;

    const token: string = core.getInput('github-token');
    const octokit: any = github.getOctokit(token);

    await octokit.rest.repos
      .getBranchProtection({
        owner: owner,
        repo: repo,
        branch: 'main',
      })
      .then((response: any) => {
        console.log(
          'Branch protection is enabled, and the numbers of reviewers are:',
          response.data.required_pull_request_reviews?.['required_approving_review_count']
        );
      })
      .catch((error: any) => {
        console.log('Branch protections is not enabled for repository: ' + repo);
        console.log('Error:', error?.message);
      });
    core.exportVariable('numberOfReviewers', numberOfReviewers);
  }
}
