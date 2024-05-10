import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import { SecretAlertsForRepoResponseDataType } from '../types/OctokitResponses';

export class SecretScanningService {
  public static async getStateOfExposedSecrets(octokit: Octokit, owner: string, repo: string): Promise<void> {
    try {
      console.log('--- Exposed secrets control ---');

      // https://www.npmjs.com/package/octokit#pagination
      const iterator: AsyncIterableIterator<SecretAlertsForRepoResponseDataType> = octokit.paginate.iterator(
        octokit.secretScanning.listAlertsForRepo,
        {
          owner: owner,
          repo: repo,
          per_page: 100,
          state: 'open',
        }
      );

      let numberOfExposedSecrets: number = 0;

      for await (const { data: alerts } of iterator) {
        numberOfExposedSecrets += alerts.length;
      }

      console.log('Exposed secrets:', numberOfExposedSecrets);
      core.exportVariable('numberOfExposedSecrets', numberOfExposedSecrets);
    } catch (error) {
      core.info('Failed to get number of exposed secrets');
      // Removes link to REST API endpoint
      const errorMessage: string = error.message.split('-')[0].trim();
      if (error.status === 401) {
        core.warning(errorMessage, {
          title: 'Number of exposed secrets control failed',
        });
      } else if (error.status === 404) {
        switch (errorMessage) {
          case 'Secret scanning is disabled on this repository.':
            core.warning(errorMessage, {
              title: 'Number of exposed secrets control failed',
            });
            break;

          default:
            console.log(error);
            core.warning('Credentials probably lack necessary permissions', {
              title: 'Number of exposed secrets control failed',
            });
            break;
        }
      } else {
        core.notice(error.message, {
          title: 'Number of exposed secrets control failed',
        });
      }
    }
    console.log();
  }
}
