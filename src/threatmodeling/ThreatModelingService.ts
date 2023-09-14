import * as core from '@actions/core';
import * as github from '@actions/github';
export class ThreatModelingService {
  public static async getStateOfThreatModeling(threatModelingDate: { date: string; boardsTag: string }): Promise<void> {
    console.log('Running Threat Modeling Controls');

    if (!threatModelingDate.date || threatModelingDate.date === 'date-of-threat-modeling') {
      core.warning('Threat Modeling Date is not set!');
      return;
    }
    core.exportVariable('threatModelingDate', threatModelingDate.date);

    console.log('threatModelingDate is set', threatModelingDate.date);
  }
}
