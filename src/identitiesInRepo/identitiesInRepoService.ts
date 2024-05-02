import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';
import { GetResponseDataTypeFromEndpointMethod, OctokitResponse } from '@octokit/types';

export class IdentitiesInRepoService {
  public static async setIdentitiesInRepoFindings(): Promise<void> {
    try {
      console.log('--- Identities In Repo Control ---');
      const { owner, repo }: { owner: string; repo: string } = github.context.repo;
      const token: string = core.getInput('PAT-token');

      const octokit: Octokit = new Octokit({
        auth: token,
      });

      type listCollaboratorsForRepoResponseDataType = GetResponseDataTypeFromEndpointMethod<
        typeof octokit.repos.listCollaborators
      >;

      // https://www.npmjs.com/package/octokit#pagination
      const iterator: AsyncIterableIterator<OctokitResponse<listCollaboratorsForRepoResponseDataType>> =
        octokit.paginate.iterator(octokit.repos.listCollaborators, {
          owner: owner,
          repo: repo,
          per_page: 100,
          affiliation: 'direct',
        });

      let numberOfAdmins: number = 0;
      let numberOfWriters: number = 0;
      let numberOfReaders: number = 0;

      for await (const { data: page } of iterator) {
        for (const user of page) {
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
      core.exportVariable('numberOfCodeAdmins', numberOfAdmins);
      core.exportVariable('numberOfCodeWriters', numberOfWriters);
      core.exportVariable('numberOfCodeReaders', numberOfReaders);
    } catch (error) {
      core.info('Failed to fetch identities for repo');
      if (error.status === 401 || error.status === 403) {
        // Removes link to REST API endpoint
        const errorMessage: string = error.message.split('.')[0];
        core.warning(errorMessage, {
          title: 'Failed to fetch identities for repo',
        });
      } else {
        core.info(error.message);
      }
    }
    console.log();
  }
}
