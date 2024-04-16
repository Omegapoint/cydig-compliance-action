import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';
import GITHUB_TOOL_SEVERITY_LEVEL from '../types/GithubToolSeverityLevel';
import { GetResponseDataTypeFromEndpointMethod, OctokitResponse } from '@octokit/types';

export class CodeQLService {
  public static async setCodeQLFindings(): Promise<void> {
    try {
      const { owner, repo }: { owner: string; repo: string } = github.context.repo;
      const token: string = core.getInput('PAT-token');

      const octokit: Octokit = new Octokit({
        auth: token,
      });

      type CodeScanningAlertsForRepoResponseDataType = GetResponseDataTypeFromEndpointMethod<
        typeof octokit.codeScanning.listAlertsForRepo
      >;

      // https://www.npmjs.com/package/octokit#pagination
      const iterator: AsyncIterableIterator<OctokitResponse<CodeScanningAlertsForRepoResponseDataType>> =
        octokit.paginate.iterator(octokit.codeScanning.listAlertsForRepo, {
          owner: owner,
          repo: repo,
          per_page: 100,
          state: 'open',
          tool_name: 'CodeQL',
        });

      let sastNumberOfSeverity1: number = 0;
      let sastNumberOfSeverity2: number = 0;
      let sastNumberOfSeverity3: number = 0;
      let sastNumberOfSeverity4: number = 0;

      for await (const { data: alerts } of iterator) {
        for (const alert of alerts) {
          switch (alert.rule.security_severity_level) {
            case GITHUB_TOOL_SEVERITY_LEVEL.LOW:
              sastNumberOfSeverity1++;
              break;
            case GITHUB_TOOL_SEVERITY_LEVEL.MEDIUM:
              sastNumberOfSeverity2++;
              break;
            case GITHUB_TOOL_SEVERITY_LEVEL.HIGH:
              sastNumberOfSeverity3++;
              break;
            case GITHUB_TOOL_SEVERITY_LEVEL.CRITICAL:
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

      core.exportVariable('SASTnumberOfSeverity1', sastNumberOfSeverity1);
      core.exportVariable('SASTnumberOfSeverity2', sastNumberOfSeverity2);
      core.exportVariable('SASTnumberOfSeverity3', sastNumberOfSeverity3);
      core.exportVariable('SASTnumberOfSeverity4', sastNumberOfSeverity4);
    } catch (error) {
      core.warning('Failed to get CodeQL severities');
      core.warning(error.message);
      core.exportVariable('SASTnumberOfSeverity1', 0);
      core.exportVariable('SASTnumberOfSeverity2', 0);
      core.exportVariable('SASTnumberOfSeverity3', 0);
      core.exportVariable('SASTnumberOfSeverity4', 0);
    }
  }
}
