import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import * as core from '@actions/core';
import { Endpoints } from '@octokit/types';

export class DependabotService {
    public static async setDependabotFindings(): Promise<void> {
        const { owner, repo }: { owner: string; repo: string } = github.context.repo;
        const token: string = core.getInput('PAT-token');

        const octokit: InstanceType<typeof GitHub> = github.getOctokit(token);
        type dependabotAlertType = Endpoints['GET /repos/{owner}/{repo}/dependabot/alerts']['response'];
        const alerts: any = await octokit.paginate(
            "GET /repos/{owner}/{repo}/dependabot/alerts",
            {
              owner: owner,
              repo: repo,
              per_page: 100,
            });

            let scaNumberOfSeverity1: number = 0 
            let scaNumberOfSeverity2: number = 0
            let scaNumberOfSeverity3: number = 0
            let scaNumberOfSeverity4: number = 0

            for (const alert of alerts){
                switch (alert.security_vulnerability.severity){
                    case "low":
                        scaNumberOfSeverity1 ++
                        break
                    case "medium":
                        scaNumberOfSeverity2 ++
                        break
                    case "high":
                        scaNumberOfSeverity3 ++
                        break
                    case "critical":
                        scaNumberOfSeverity4 ++
                        break
                }
            }


            console.log('\n scaNumberOfSeverity1: ' + scaNumberOfSeverity1);
            console.log('\n scaNumberOfSeverity2: ' + scaNumberOfSeverity2);
            console.log('\n scaNumberOfSeverity3: ' + scaNumberOfSeverity3);
            console.log('\n scaNumberOfSeverity4: ' + scaNumberOfSeverity4);

            core.exportVariable('scaNumberOfSeverity1', scaNumberOfSeverity1);
            core.exportVariable('scaNumberOfSeverity2', scaNumberOfSeverity2);
            core.exportVariable('scaNumberOfSeverity3', scaNumberOfSeverity3);
            core.exportVariable('scaNumberOfSeverity4', scaNumberOfSeverity4);
    }
  }