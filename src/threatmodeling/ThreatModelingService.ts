import * as core from '@actions/core';
export class ThreatModelingService {
    public static async getStateOfThreatModeling(threatModeling: { date: string; boardsTag?: string }): Promise<void> {
        console.log('--- Threat Modeling control ---');
        if (process.env.threatModelingDate) {
            console.log('Threat Modeling date was found');
            core.exportVariable('threatModelingDate', process.env.threatModelingDate);
        } else {
            if (!threatModeling.date || threatModeling.date === 'date-of-threat-modeling') {
                core.warning('Threat Modeling Date is not set!');
                return;
            }
            console.log('Threat Modeling date was found');
            core.exportVariable('threatModelingDate', threatModeling.date);
        }
        console.log();
    }
}
