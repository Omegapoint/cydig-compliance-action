import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import GITHUB_TOOL_SEVERITY_LEVEL from '../types/GithubToolSeverityLevel';
import { DependabotAlertsForRepoResponseDataType } from '../types/OctokitResponses';

export class DependabotService {
  public static async setDependabotFindings(octokit: Octokit, owner: string, repo: string): Promise<void> {
    try {
      // https://www.npmjs.com/package/octokit#pagination
      const iterator: AsyncIterableIterator<DependabotAlertsForRepoResponseDataType> = octokit.paginate.iterator(
        octokit.dependabot.listAlertsForRepo,
        {
          owner: owner,
          repo: repo,
          per_page: 100,
          state: 'open',
        }
      );

      let scaNumberOfSeverity1: number = 0;
      let scaNumberOfSeverity2: number = 0;
      let scaNumberOfSeverity3: number = 0;
      let scaNumberOfSeverity4: number = 0;

      for await (const { data: alerts } of iterator) {
        for (const alert of alerts) {
          switch (alert.security_vulnerability.severity) {
            case GITHUB_TOOL_SEVERITY_LEVEL.LOW:
              scaNumberOfSeverity1++;
              break;
            case GITHUB_TOOL_SEVERITY_LEVEL.MEDIUM:
              scaNumberOfSeverity2++;
              break;
            case GITHUB_TOOL_SEVERITY_LEVEL.HIGH:
              scaNumberOfSeverity3++;
              break;
            case GITHUB_TOOL_SEVERITY_LEVEL.CRITICAL:
              scaNumberOfSeverity4++;
              break;
          }
        }
      }

      console.log('Low: ' + scaNumberOfSeverity1);
      console.log('Medium: ' + scaNumberOfSeverity2);
      console.log('High: ' + scaNumberOfSeverity3);
      console.log('Critical: ' + scaNumberOfSeverity4);

      core.exportVariable('SCAnumberOfSeverity1', scaNumberOfSeverity1);
      core.exportVariable('SCAnumberOfSeverity2', scaNumberOfSeverity2);
      core.exportVariable('SCAnumberOfSeverity3', scaNumberOfSeverity3);
      core.exportVariable('SCAnumberOfSeverity4', scaNumberOfSeverity4);
    } catch (error) {
      core.info('Failed to get Dependabot severities');
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        // Removes link to REST API endpoint
        const errorMessage: string = error.message.split('.')[0];
        core.warning(errorMessage, {
          title: 'SCA tool control failed',
        });
      } else {
        core.notice(error.message, {
          title: 'SCA tool control failed',
        });
      }
      core.exportVariable('SCAnumberOfSeverity1', 0);
      core.exportVariable('SCAnumberOfSeverity2', 0);
      core.exportVariable('SCAnumberOfSeverity3', 0);
      core.exportVariable('SCAnumberOfSeverity4', 0);
    }
  }
}
