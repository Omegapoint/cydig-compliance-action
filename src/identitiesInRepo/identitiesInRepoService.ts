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
      const iterator: any = octokit.paginate.iterator(octokit.repos.listCollaborators, {
        owner: owner,
        repo: repo,
        per_page: 100,
      });

      let numberOfAdmins: number = 0;
      let numberOfWriters: number = 0;
      let numberOfReaders: number = 0;

      for await (const { data: page } of iterator) {
        for (const user of page) {
          console.log(user)
          if (user.permissions!.admin) {
            numberOfAdmins++;
          } else if (user.permissions!.maintain!) {
            numberOfWriters++;
          } else if (user.permissions!.push!) {
            numberOfWriters++;
          } else if (user.permissions!.triage!) {
            numberOfReaders++;
          } else if (user.permissions!.pull!) {
            numberOfReaders++;
          }
        }
      }
      console.log('numberOfAdmins: ' + numberOfAdmins);
      console.log('numberOfWriters: ' + numberOfWriters);
      console.log('numberOfReaders: ' + numberOfReaders);
    } catch (error) {
      core.warning('Failed to fetch identities for repo');
      core.warning(error.message);
    }
    console.log();
  }
}
