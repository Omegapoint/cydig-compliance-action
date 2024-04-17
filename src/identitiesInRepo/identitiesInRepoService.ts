import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';

export class IdentitiesInRepoService {
  public static async setIdentitiesInRepoFindings(): Promise<void> {
    try {
      console.log('--- Identities In Repo Control ---');
      const { owner, repo }: { owner: string; repo: string } = github.context.repo;
      const token: string = core.getInput('PAT-token');

      const octokit: Octokit = new Octokit({
        auth: token,
      });

      // https://www.npmjs.com/package/octokit#pagination
      const iterator: any = octokit.paginate.iterator(octokit.repos.listContributors, {
        owner: owner,
        repo: repo,
        per_page: 100,
      });

      for await (const { data: page } of iterator) {
        for (const user of page) {
          console.log('---');
          console.log(user.type);
          console.log(user);
        }
      }
    } catch (error) {
      core.warning('Failed to fetch identities for repo');
      core.warning(error.message);
    }
    console.log();
  }
}
