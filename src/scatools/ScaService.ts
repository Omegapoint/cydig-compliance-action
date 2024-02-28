import * as core from '@actions/core';

export class ScaService {
  public static async getStateOfScaTool(scaTool: string): Promise<void> {
    if (process.env.scaTool) {
      core.exportVariable('scaTool', process.env.scaTool);
    } else {
      if (!scaTool || scaTool === 'name-of-tool') {
        core.warning('Sca Tool is not set!');
        return;
      }
      core.exportVariable('scaTool', scaTool);
    }
  }
}
