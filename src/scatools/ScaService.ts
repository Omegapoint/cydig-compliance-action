import * as core from '@actions/core';

export class ScaService {
  public static async getStateOfScaTool(scaTool: string): Promise<void> {
    console.log('\n Running SCA control');
    if (process.env.scaTool) {
      console.log(`SCA Tool: ${process.env.scaTool}`);
      core.exportVariable('scaTool', process.env.scaTool);
    } else {
      if (!scaTool || scaTool === 'name-of-tool') {
        core.warning('SCA Tool is not set!');
        return;
      }
      console.log(`SCA Tool: ${scaTool}`);
      core.exportVariable('scaTool', scaTool);
    }
  }
}
