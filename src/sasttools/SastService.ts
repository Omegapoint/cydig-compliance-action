import * as core from '@actions/core';

export class SastService {
  public static async getStateOfSastTool(sastTool: { nameOfTool: string }): Promise<void> {
    console.log('\n Running SAST control');
    if (process.env.sastTool) {
      console.log(`SAST Tool: ${process.env.sastTool}`);
      core.exportVariable('sastTool', process.env.sastTool);
    } else {
      if (!sastTool.nameOfTool || sastTool.nameOfTool === 'name-of-tool') {
        core.warning('SAST Tool is not set!');
        return;
      }
      console.log(`SAST Tool: ${sastTool.nameOfTool}`);
      core.exportVariable('sastTool', sastTool.nameOfTool);
    }
  }
}
