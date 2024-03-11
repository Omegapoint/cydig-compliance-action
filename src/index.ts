import * as core from '@actions/core';
import { BranchProtectionService } from './branchprotection/BranchProtectionService';
import { CyDigConfig } from './types/CyDigConfig';
import { getContentOfFile } from './helpfunctions/JsonService';
import { PentestService } from './pentest/PentestService';
import { ThreatModelingService } from './threatmodeling/ThreatModelingService';
import { AzureDevOpsBoardService } from './azuredevopsboard/AzureDevOpsBoardService';
import { CodeQualityService } from './codequalitytools/CodeQualityService';
import { SastService } from './sasttools/SastService';
import { ScaService } from './scatools/ScaService';
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    console.log('\n Running controls on your repository');
    const cydigConfig: CyDigConfig = getContentOfFile(core.getInput('cydigConfigPath'));

    await CodeQualityService.getStateOfCodeQualityTool(cydigConfig.codeQualityTool);
    await SastService.getStateOfSastTool(cydigConfig.sastTool);
    await ScaService.getStateOfScaTool(cydigConfig.scaTool);

    await BranchProtectionService.getStateOfBranchProtection();

    await PentestService.getStateOfPentest(cydigConfig.pentest);
    await ThreatModelingService.getStateOfThreatModeling(cydigConfig.threatModeling);
  
    await AzureDevOpsBoardService.getStateOfAzureDevOpsBoards(cydigConfig);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
