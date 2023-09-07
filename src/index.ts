import * as core from '@actions/core';
import * as github from '@actions/github';
import { BranchProtectionService } from './branchprotection/BranchProtectionService';
import { CyDigConfig } from './types/CyDigConfig';
import { getContentOfFile } from './helpfunctions/JsonService';
import { PentestService } from './Pentest/PentestService';
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const cydigConfig: CyDigConfig = getContentOfFile("./cydigconfig.json");
    await PentestService.getStateOfPentest(cydigConfig.pentest); 
    
    await BranchProtectionService.getStateOfBranchProtection();

    
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
