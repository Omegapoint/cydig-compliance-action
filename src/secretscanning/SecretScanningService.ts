import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';
import { GetResponseDataTypeFromEndpointMethod, OctokitResponse } from '@octokit/types';

export class SecretScanningService {
  public static async getStateOfExposedSecrets(): Promise<void> {
    try {
      console.log('--- Exposed secrets control ---');
      const { owner, repo }: { owner: string; repo: string } = github.context.repo;
      const token: string = core.getInput('PAT-token');

      const octokit: Octokit = new Octokit({
        auth: token,
      });

      type SecretAlertsForRepoResponseDataType = GetResponseDataTypeFromEndpointMethod<
        typeof octokit.secretScanning.listAlertsForRepo
      >;

      // https://www.npmjs.com/package/octokit#pagination
      const iterator: AsyncIterableIterator<OctokitResponse<SecretAlertsForRepoResponseDataType>> =
        octokit.paginate.iterator(octokit.secretScanning.listAlertsForRepo, {
          owner: owner,
          repo: repo,
          per_page: 100,
          state: 'open',
        });

      let numberOfExposedSecrets: number = 0;

      for await (const { data: alerts } of iterator) {
        numberOfExposedSecrets += alerts.length;
      }

      console.log('Exposed secrets:', numberOfExposedSecrets);
      core.exportVariable('numberOfExposedSecrets', numberOfExposedSecrets);
    } catch (error) {
      core.warning('Failed to get number of exposed secrets');
      core.warning('Error status:', error.status);
      core.warning(error.message);
      core.exportVariable('numberOfExposedSecrets', 0);
    }
    console.log('');
  }
}
