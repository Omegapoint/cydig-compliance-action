import * as core from '@actions/core';
import { CodeQLService } from './CodeQLService';

export class SastService {
  public static async getStateOfSastTool(sastTool: { nameOfTool: string }): Promise<void> {
    console.log('--- SAST control ---');
    let sast: string = sastTool.nameOfTool;
    if (process.env.sastTool) {
      sast = process.env.sastTool;
    }
    console.log(`Tool:`, `${sast}`);
    core.exportVariable('sastTool', sast);

    if (!sast || sast === '' || sast === 'name-of-tool') {
      core.warning('SAST Tool is not set!');
      return;
    }

    if (sast.toLowerCase() === 'codeql') {
      await CodeQLService.setCodeQLFindings();
    }
    console.log('\n');
  }
}
