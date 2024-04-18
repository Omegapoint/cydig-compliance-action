import * as core from '@actions/core';
import * as github from '@actions/github';
import { Endpoints } from '@octokit/types';
import { GitHub } from '@actions/github/lib/utils';
export class BranchProtectionService {
  public static async getStateOfBranchProtection(): Promise<void> {
    try {
      console.log('--- Branch protection control ---');
      const { owner, repo }: { owner: string; repo: string } = github.context.repo;
      const token: string = core.getInput('PAT-token');

      const octokit: InstanceType<typeof GitHub> = github.getOctokit(token);
      type branchProtectionRepsponse = Endpoints['GET /repos/{owner}/{repo}/branches/{branch}/protection']['response'];
      const response: branchProtectionRepsponse = await octokit.rest.repos.getBranchProtection({
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
      core.info('Failed to get branch protection');
      if (error.status === 401) {
        core.warning(error.message, {
          title: 'Branch protection control failed',
        });
      } else if (error.status === 404) {
        core.info(error.status);
        core.info(error.errors);

        // Status code '404' means 'Branch not protected'
        core.notice('Branch protection is not enabled for this repository or credentials lack permissions', {
          title: 'Branch protection control',
        });
        core.exportVariable('numberOfReviewers', 0);
      } else {
        core.notice(error.message, {
          title: 'Branch protection control failed',
        });
      }
    }
    console.log();
  }
}
