import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';

export class DependabotService {
    public static async setDependabotFindings(): Promise<void> {

        const { owner, repo }: { owner: string; repo: string } = github.context.repo;
        const token: string = core.getInput('PAT-token');
        const octokit = new Octokit({
            auth: token
        });
        
        const iterator = octokit.paginate.iterator(
            octokit.dependabot.listAlertsForRepo,
            {
                owner: owner,
                repo: repo,
                per_page: 100,
                state: "open"
            }
        )
        
        let scaNumberOfSeverity1: number = 0 
        let scaNumberOfSeverity2: number = 0
        let scaNumberOfSeverity3: number = 0
        let scaNumberOfSeverity4: number = 0
        
        for await (const {data: alerts } of iterator) {
            for(const alert of alerts) {
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
        }
        
        console.log(scaNumberOfSeverity1);
        console.log(scaNumberOfSeverity2);
        console.log(scaNumberOfSeverity3);
        console.log(scaNumberOfSeverity4);
        

        core.exportVariable('scaNumberOfSeverity1', scaNumberOfSeverity1);
        core.exportVariable('scaNumberOfSeverity2', scaNumberOfSeverity2);
        core.exportVariable('scaNumberOfSeverity3', scaNumberOfSeverity3);
        core.exportVariable('scaNumberOfSeverity4', scaNumberOfSeverity4);
    }
  }