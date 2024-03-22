import * as core from '@actions/core';
import { CodeQLService } from './CodeQLService';

export class SastService {
  public static async getStateOfSastTool(sastTool: { nameOfTool: string }): Promise<void> {
    console.log('\n Running SAST control');
    let sast: string = sastTool.nameOfTool;
    if (process.env.sastTool) {
      sast = process.env.sastTool;
    }
    console.log(`SAST Tool: ${sast}`);
    core.exportVariable('sastTool', sast);

    if (!sast || sast === '' || sast === 'name-of-tool') {
      core.warning('SAST Tool is not set!');
      return;
    }

    if (sast.toLowerCase() === 'codeql') {
      CodeQLService.setCodeQLFindings();
    }
  }
}
