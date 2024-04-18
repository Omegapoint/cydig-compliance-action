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
      core.info(error.status);
      core.info('Failed to get number of exposed secrets');
      if (error.status === 401 || error.status === 404) {
        core.warning(error.message, {
          title: 'Number of exposed secrets control failed',
        });
      } else {
        core.notice(error.message, {
          title: 'Number of exposed secrets control failed',
        });
      }
    }
    console.log();
  }
}
