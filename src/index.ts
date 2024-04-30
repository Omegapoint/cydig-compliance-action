import { BranchProtectionService } from './branchprotection/BranchProtectionService';
import { CyDigConfig } from './types/CyDigConfig';
import { getContentOfFile } from './helpfunctions/JsonService';
import { PentestService } from './pentest/PentestService';
import { ThreatModelingService } from './threatmodeling/ThreatModelingService';
import { AzureDevOpsBoardService } from './azuredevopsboard/AzureDevOpsBoardService';
import { CodeQualityService } from './codequalitytools/CodeQualityService';
import { SastService } from './sasttools/SastService';
import { ScaService } from './scatools/ScaService';
import { SecretScanningService } from './secretscanning/SecretScanningService';
import { context } from '@actions/github';
import { getInput, setFailed } from '@actions/core';
import { Octokit } from '@octokit/rest';
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

    const octokit: Octokit = new Octokit({
      auth: token,
    });

    await CodeQualityService.getStateOfCodeQualityTool(cydigConfig.codeQualityTool);
    await SastService.getStateOfSastTool(cydigConfig.sastTool.nameOfTool, octokit, owner, repo);
    await ScaService.getStateOfScaTool(cydigConfig.scaTool.nameOfTool, octokit, owner, repo);
    await SecretScanningService.getStateOfExposedSecrets(octokit, owner, repo);

    await BranchProtectionService.getStateOfBranchProtection(octokit, owner, repo);

    await PentestService.getStateOfPentest(cydigConfig.pentest);
    await ThreatModelingService.getStateOfThreatModeling(cydigConfig.threatModeling);

    await AzureDevOpsBoardService.getStateOfAzureDevOpsBoards(cydigConfig);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) setFailed(error.message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
