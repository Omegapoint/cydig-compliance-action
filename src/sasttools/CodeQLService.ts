import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';

export class DependabotService {
  public static async setDependabotFindings(): Promise<void> {
    try{
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
        });

        let sastNumberOfSeverity1: number = 0;
        let sastNumberOfSeverity2: number = 0
        let sastNumberOfSeverity3: number = 0;
        let sastNumberOfSeverity4: number = 0;

        for await (const { data: alerts } of iterator) {
        for (const alert of alerts) {
            switch (alert.rule.severity) {
            case 'warning':
                sastNumberOfSeverity1++;
                break;
            case 'note':
                sastNumberOfSeverity2++;
                break;
            case 'error':
            sastNumberOfSeverity3++;
                break;
            case 'none':
                sastNumberOfSeverity4++
                break;
            default:
                break;
            }
        }
        }

        console.log('sastNumberOfSeverityWarning: ' + sastNumberOfSeverity1);
        console.log('sastNumberOfSeverityNote: ' + sastNumberOfSeverity2);
        console.log('sastNumberOfSeverityError: ' + sastNumberOfSeverity3);
        console.log('sastNumberOfSeverityNone: ' + sastNumberOfSeverity4);

        core.exportVariable('SASTnumberOfSeverity1', sastNumberOfSeverity1);
        core.exportVariable('SASTnumberOfSeverity2', sastNumberOfSeverity2);
        core.exportVariable('SASTnumberOfSeverity3', sastNumberOfSeverity3);
        core.exportVariable('SASTnumberOfSeverity4', sastNumberOfSeverity4);
    }
    catch(error){
        core.warning('Could not set CodeQL severities');
        core.exportVariable('SASTnumberOfSeverity1', 0);
        core.exportVariable('SASTnumberOfSeverity2', 0);
        core.exportVariable('SASTnumberOfSeverity3', 0);
        core.exportVariable('SASTnumberOfSeverity4', 0);
    }

  }
}