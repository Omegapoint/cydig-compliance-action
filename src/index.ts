import { getInput, setFailed } from '@actions/core';
import { context } from '@actions/github';
import { retry } from '@octokit/plugin-retry';
import { Octokit } from '@octokit/rest';
import { AzureDevOpsBoardService } from './azuredevopsboard/AzureDevOpsBoardService';
import { BranchProtectionService } from './branchprotection/BranchProtectionService';
import { CodeQualityService } from './codequalitytools/CodeQualityService';
import { getContentOfFile } from './helpfunctions/JsonService';
import { PentestService } from './pentest/PentestService';
import { SastService } from './sasttools/SastService';
import { ScaService } from './scatools/ScaService';
import { SecretScanningService } from './secretscanning/SecretScanningService';
import { AccessToCodeService } from './AccessToCode/AccessToCodeService';
import { ThreatModelingService } from './threatmodeling/ThreatModelingService';
import { CyDigConfig } from './types/CyDigConfig';
import { CommunicationService } from './communication/CommunicationService';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
    try {
        console.log('Running compliance controls \n');
        const cydigConfig: CyDigConfig = getContentOfFile(getInput('cydigConfigPath'));
        const { owner, repo }: { owner: string; repo: string } = context.repo;
        const token: string = getInput('PAT-token');
        // eslint-disable-next-line
        const OctokitRetry = Octokit.plugin(retry);
        const octokit: Octokit = new OctokitRetry({
            auth: token,
        });

        await CodeQualityService.getStateOfCodeQualityTool(cydigConfig.codeQualityTool);
        await SastService.getStateOfSastTool(cydigConfig.sastTool.nameOfTool, octokit, owner, repo);
        await ScaService.getStateOfScaTool(cydigConfig.scaTool.nameOfTool, octokit, owner, repo);
        await SecretScanningService.getStateOfExposedSecrets(
            cydigConfig.secretScanningTool?.nameOfTool,
            octokit,
            owner,
            repo,
        );
        await BranchProtectionService.getStateOfBranchProtection(octokit, owner, repo);
        await AccessToCodeService.setAccessToCodeFindings(octokit, owner, repo);
        await PentestService.getStateOfPentest(cydigConfig.pentest);
        await ThreatModelingService.getStateOfThreatModeling(cydigConfig.threatModeling);
        await AzureDevOpsBoardService.getStateOfAzureDevOpsBoards(cydigConfig);
        //TODO: When we can use access to code for all teams, remove the if-statement
        if (cydigConfig.teamName.toLowerCase() === 'cydig') {
            await CommunicationService.getStateOfCommunication(cydigConfig);
        }
    } catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error) setFailed(error.message);
    }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
