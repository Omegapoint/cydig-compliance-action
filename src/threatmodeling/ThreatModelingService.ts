import * as core from '@actions/core';
export class ThreatModelingService {
  public static async getStateOfThreatModeling(threatModeling: { date: string; boardsTag: string }): Promise<void> {
    let threatModelingDate: string = process.env.threatModelingDate || '';
    if (threatModelingDate === '') {
      if (!threatModeling.date || threatModeling.date === 'date-of-threat-modeling') {
        core.warning('Threat Modeling Date is not set!');
        return;
      }
      threatModelingDate = threatModeling.date;
    }
    core.exportVariable('threatModelingDate', threatModelingDate);
  }
}
