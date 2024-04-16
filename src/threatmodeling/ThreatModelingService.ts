import * as core from '@actions/core';
export class ThreatModelingService {
  public static async getStateOfThreatModeling(threatModeling: { date: string; boardsTag?: string }): Promise<void> {
    console.log('--- Threat modeling control ---');
    if (process.env.threatModelingDate) {
      core.exportVariable('threatModelingDate', process.env.threatModelingDate);
    } else {
      if (!threatModeling.date || threatModeling.date === 'date-of-threat-modeling') {
        core.warning('Threat Modeling Date is not set!');
        return;
      }
      core.exportVariable('threatModelingDate', threatModeling.date);
    }
    console.log();
  }
}
