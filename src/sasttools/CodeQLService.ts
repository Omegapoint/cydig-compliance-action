import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';
import GITHUB_TOOL_SEVERITY_LEVEL from '../types/GithubToolSeverityLevel';

export class CodeQLService {
  public static async setCodeQLFindings(): Promise<void> {
    try {
      const { owner, repo }: { owner: string; repo: string } = github.context.repo;
      const token: string = core.getInput('PAT-token');

      const octokit = new Octokit({
        auth: token,
      });

      // https://www.npmjs.com/package/octokit#pagination
      const iterator = octokit.paginate.iterator(octokit.codeScanning.listAlertsForRepo, {
        owner: owner,
        repo: repo,
        per_page: 100,
        state: 'open',
        tool_name: 'CodeQL',
      });

      let SASTNumberOfSeverity1: number = 0;
      let SASTNumberOfSeverity2: number = 0;
      let SASTNumberOfSeverity3: number = 0;
      let SASTNumberOfSeverity4: number = 0;

      for await (const { data: alerts } of iterator) {
        for (const alert of alerts) {
          switch (alert.rule.security_severity_level) {
            case GITHUB_TOOL_SEVERITY_LEVEL.LOW:
              SASTNumberOfSeverity1++;
              break;
            case GITHUB_TOOL_SEVERITY_LEVEL.MEDIUM:
              SASTNumberOfSeverity2++;
              break;
            case GITHUB_TOOL_SEVERITY_LEVEL.HIGH:
              SASTNumberOfSeverity3++;
              break;
            case GITHUB_TOOL_SEVERITY_LEVEL.CRITICAL:
              SASTNumberOfSeverity4++;
              break;
            default:
              break;
          }
        }
      }

      console.log('sastNumberOfSeveritylow: ' + SASTNumberOfSeverity1);
      console.log('sastNumberOfSeverityMedium: ' + SASTNumberOfSeverity2);
      console.log('sastNumberOfSeverityHigh: ' + SASTNumberOfSeverity3);
      console.log('sastNumberOfSeverityCritical: ' + SASTNumberOfSeverity4);

      core.exportVariable('SASTnumberOfSeverity1', SASTNumberOfSeverity1);
      core.exportVariable('SASTnumberOfSeverity2', SASTNumberOfSeverity2);
      core.exportVariable('SASTnumberOfSeverity3', SASTNumberOfSeverity3);
      core.exportVariable('SASTnumberOfSeverity4', SASTNumberOfSeverity4);
    } catch (error) {
      core.warning('Could not set CodeQL severities');
      core.exportVariable('SASTnumberOfSeverity1', 0);
      core.exportVariable('SASTnumberOfSeverity2', 0);
      core.exportVariable('SASTnumberOfSeverity3', 0);
      core.exportVariable('SASTnumberOfSeverity4', 0);
    }
  }
}
