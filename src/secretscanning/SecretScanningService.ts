import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';
import { OctokitResponse, GetResponseDataTypeFromEndpointMethod } from '@octokit/types';

export class SecretScanningService {
  public static async getStateOfExposedSecrets(): Promise<void> {
    try {
      console.log('\n Running exposed secrets control');
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

      console.log('Number of exposed secrets:', numberOfExposedSecrets);

      core.exportVariable('numberOfExposedSecrets', numberOfExposedSecrets);
    } catch (error) {
      console.log('Error status:', error.status);
      console.log(error);
      if (error.status === 404) {
        core.warning('Secret scanning is disabled or repository is public');
      } else {
        core.warning('Error getting number of exposed secrets');
      }
      core.exportVariable('numberOfExposedSecrets', 0);
    }
  }
}
