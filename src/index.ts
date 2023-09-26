import * as core from '@actions/core';
import { BranchProtectionService } from './branchprotection/BranchProtectionService';
import { CyDigConfig } from './types/CyDigConfig';
import { getContentOfFile } from './helpfunctions/JsonService';
import { PentestService } from './Pentest/PentestService';
import { ThreatModelingService } from './threatmodeling/ThreatModelingService';
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    console.log('\n Running controls on your repository');
    const cydigConfig: CyDigConfig = getContentOfFile(core.getInput('cydigConfigPath'));
    await BranchProtectionService.getStateOfBranchProtection();

    console.log('\n Running controls on your boards');
    await PentestService.getStateOfPentest(cydigConfig.pentest);
    await ThreatModelingService.getStateOfThreatModeling(cydigConfig.threatModeling);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
