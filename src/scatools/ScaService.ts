import * as core from '@actions/core';
import { DependabotService } from './DependabotService';

export class ScaService {
  public static async getStateOfScaTool(scaTool: { nameOfTool: string }): Promise<void> {
    console.log('\n Running SCA control');
    let sca: string = scaTool.nameOfTool;
    if (process.env.scaTool) {
      sca = process.env.scaTool;
    }
    console.log(`SCA Tool: ${sca}`);
    core.exportVariable('scaTool', sca);

    if (!sca || sca === '' || sca === 'name-of-tool') {
      core.warning('SCA Tool is not set!');
      return;
    }

    if (sca.toLowerCase() === 'dependabot') {
      await DependabotService.setDependabotFindings();
    }
  }
}
