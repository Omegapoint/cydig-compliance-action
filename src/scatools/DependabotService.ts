import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import * as core from '@actions/core';
import { Endpoints } from '@octokit/types';
import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';

export class DependabotService {
    public static async setDependabotFindings(): Promise<void> {

        const { owner, repo }: { owner: string; repo: string } = github.context.repo;
        const token: string = core.getInput('PAT-token');
        // type dependabotAlertType = Endpoints['GET /repos/{owner}/{repo}/dependabot/alerts']['response'];
        // const octokit: InstanceType<typeof GitHub> = github.getOctokit(token);
        const octokit = new Octokit({
            auth: token,
            request: {
                fetch: fetch
            }
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
        
        // const alerts: any = await octokit.paginate(
        //     "GET /repos/{owner}/{repo}/dependabot/alerts",
        //     {
        //       owner: owner,
        //       repo: repo,
        //       per_page: 100,
        //     });
    
        // for (const alert of alerts){
        //     for(const a of alert.data) {
        //     }
        //     switch (alert){
        //         case "low":
        //             scaNumberOfSeverity1 ++
        //             break
        //         case "medium":
        //             scaNumberOfSeverity2 ++
        //             break
        //         case "high":
        //             scaNumberOfSeverity3 ++
        //             break
        //         case "critical":
        //             scaNumberOfSeverity4 ++
        //             break
        //     }
        // }

        core.exportVariable('scaNumberOfSeverity1', scaNumberOfSeverity1);
        core.exportVariable('scaNumberOfSeverity2', scaNumberOfSeverity2);
        core.exportVariable('scaNumberOfSeverity3', scaNumberOfSeverity3);
        core.exportVariable('scaNumberOfSeverity4', scaNumberOfSeverity4);
    }

    // public static async setDependabotFindings2(): Promise<void> {

    //     const { owner, repo }: { owner: string; repo: string } = github.context.repo;
    //     const token: string = core.getInput('PAT-token');

    //     const octokit: InstanceType<typeof GitHub> = github.getOctokit(token);
    //     type dependabotAlertType = Endpoints['GET /repos/{owner}/{repo}/dependabot/alerts']['response'];

    //     const alerts: Array<dependabotAlertType> = await octokit.paginate(
    //         "GET /repos/{owner}/{repo}/dependabot/alerts",
    //         {
    //           owner: owner,
    //           repo: repo,
    //           per_page: 100,
    //         });

    //     const severeties = alerts.flatMap((alert) => DependabotService.GetSeverity(alert));
        
    //     const lowSeverityCount = DependabotService.severityCountForGivenSeverity(severeties, "low");
    //     const mediumSeverityCount = DependabotService.severityCountForGivenSeverity(severeties, "medium");
    //     const highwSeverityCount = DependabotService.severityCountForGivenSeverity(severeties, "high");
    //     const criticalSeverityCount = DependabotService.severityCountForGivenSeverity(severeties, "critical");

    //     core.exportVariable('scaNumberOfSeverity1', lowSeverityCount);
    //     core.exportVariable('scaNumberOfSeverity2', mediumSeverityCount);
    //     core.exportVariable('scaNumberOfSeverity3', highwSeverityCount);
    //     core.exportVariable('scaNumberOfSeverity4', criticalSeverityCount);
    // }

    // private static severityCountForGivenSeverity(severeties: ("low" | "medium" | "high" | "critical")[], severity: string) {
    //     return severeties.filter((allert) => allert === severity).length;
    // }

    // private static GetSeverity(alert): "low" | "medium" | "high" | "critical" | readonly ("low" | "medium" | "high" | "critical")[] {
    //     return alert.data.flatMap((data) => data.security_vulnerability.severity);
    // }
  }