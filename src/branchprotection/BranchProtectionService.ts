/* eslint-disable @typescript-eslint/typedef */
import * as core from '@actions/core';
import * as github from '@actions/github';
// import { Octokit } from 'octokit';
export class BranchProtectionService {
  public static async getStateOfBranchProtection(): Promise<void> {
    try {
      console.log('\n Running branch protection control');
      const { owner, repo }: { owner: string; repo: string } = github.context.repo;
      const token: string = core.getInput('PAT-token');

      // const octokit = new Octokit({ auth: token });
      // const response = await octokit.request(`GET /repos/${owner}/${repo}/branches/main/protection`, {
      //   owner,
      //   repo,
      //   branch: 'main',
      // });
      const headers = {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
      };

      const branchProtectionUrl = `https://api.github.com/repos/${owner}/${repo}/branches/main/protection`;
      const response = await fetch(branchProtectionUrl, {
        method: 'GET',
        headers,
      });
      console.log('Response:', response);
      const data = await response.json();
      console.log('Data:', data);
      if (data.enforce_admins?.enabled === false) {
        console.log('Branch protection can be overridden by admins and is therefore counted as not enabled');
      }

      const numberOfReviewers: number = data.required_pull_request_reviews?.required_approving_review_count || 0;

      if (numberOfReviewers >= 1 && data.enforce_admins?.enabled === true) {
        console.log('Branch protection is enabled, number of reviewers:', numberOfReviewers);
      } else {
        console.log('Branch protection is not enabled for repository:', repo);
      }

      core.exportVariable('numberOfReviewers', numberOfReviewers);
    } catch (error) {
      console.log('Error:', error.message);
    }
  }
}
