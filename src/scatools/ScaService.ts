import * as core from '@actions/core';
import { DependabotService } from './DependabotService';

export class ScaService {
  public static async getStateOfScaTool(scaTool: { nameOfTool: string }): Promise<void> {
    console.log('\n Running SCA control');
    if (process.env.scaTool) {
      console.log(`SCA Tool: ${process.env.scaTool}`);
      core.exportVariable('scaTool', process.env.scaTool);
    } else {
      if (!scaTool.nameOfTool || scaTool.nameOfTool === 'name-of-tool') {
        core.warning('SCA Tool is not set!');
        return;
      }

      if(scaTool.nameOfTool === "dependabot"){
        DependabotService.setDependabotFindings()
      }

      console.log(`SCA Tool: ${scaTool.nameOfTool}`);
      core.exportVariable('scaTool', scaTool.nameOfTool);
    }
  }
}
