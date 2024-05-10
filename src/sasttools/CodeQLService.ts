import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import GitHub_Tool_Severity_Level from '../types/GithubToolSeverityLevel';
import { CodeScanningAlertsForRepoResponseDataType } from '../types/OctokitResponses';

export class CodeQLService {
  public static async setCodeQLFindings(
    nameOfTool: string,
    octokit: Octokit,
    owner: string,
    repo: string
  ): Promise<void> {
    try {
      // https://www.npmjs.com/package/octokit#pagination
      const iterator: AsyncIterableIterator<CodeScanningAlertsForRepoResponseDataType> = octokit.paginate.iterator(
        octokit.codeScanning.listAlertsForRepo,
        {
          owner: owner,
          repo: repo,
          per_page: 100,
          state: 'open',
          tool_name: 'CodeQL',
        }
      );

      let sastNumberOfSeverity1: number = 0;
      let sastNumberOfSeverity2: number = 0;
      let sastNumberOfSeverity3: number = 0;
      let sastNumberOfSeverity4: number = 0;

      for await (const { data: alerts } of iterator) {
        for (const alert of alerts) {
          switch (alert.rule.security_severity_level) {
            case GitHub_Tool_Severity_Level.LOW:
              sastNumberOfSeverity1++;
              break;
            case GitHub_Tool_Severity_Level.MEDIUM:
              sastNumberOfSeverity2++;
              break;
            case GitHub_Tool_Severity_Level.HIGH:
              sastNumberOfSeverity3++;
              break;
            case GitHub_Tool_Severity_Level.CRITICAL:
              sastNumberOfSeverity4++;
              break;
            default:
              break;
          }
        }
      }

      console.log('Low: ' + sastNumberOfSeverity1);
      console.log('Medium: ' + sastNumberOfSeverity2);
      console.log('High: ' + sastNumberOfSeverity3);
      console.log('Critical: ' + sastNumberOfSeverity4);

      core.exportVariable('sastTool', nameOfTool);
      core.exportVariable('SASTnumberOfSeverity1', sastNumberOfSeverity1);
      core.exportVariable('SASTnumberOfSeverity2', sastNumberOfSeverity2);
      core.exportVariable('SASTnumberOfSeverity3', sastNumberOfSeverity3);
      core.exportVariable('SASTnumberOfSeverity4', sastNumberOfSeverity4);
    } catch (error) {
      core.info('Failed to get CodeQL severities');
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        // Removes link to REST API endpoint
        const errorMessage: string = error.message.split('-')[0].trim();
        core.warning(errorMessage, {
          title: 'SAST tool control failed',
        });
      } else {
        core.notice(error.message, {
          title: 'SAST tool control failed',
        });
      }
    }
  }
}
