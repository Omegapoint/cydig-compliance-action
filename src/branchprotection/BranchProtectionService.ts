import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import { Endpoints } from '@octokit/types';
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
      if (error.status === 401) {
        core.info('Failed to get branch protection');
        core.warning(error.message, {
          title: 'Branch protection control failed',
        });
      } else if (error.status === 404) {
        if (error.message === 'Branch not protected') {
          // Status code '404' means 'Branch not protected'
          core.notice(error.message, {
            title: 'Branch protection control',
          });
          core.exportVariable('numberOfReviewers', 0);
        } else {
          core.info('Failed to get branch protection');
          core.warning('Credentials probably lack necessary permissions', {
            title: 'Branch protection control failed',
          });
        }
      } else {
        core.info('Failed to get branch protection');
        core.notice(error.message, {
          title: 'Branch protection control failed',
        });
      }
    }
    console.log();
  }
}
