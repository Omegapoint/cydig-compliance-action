import * as core from '@actions/core';

export class SastService {
  public static async getStateOfSastTool(sastTool: string): Promise<void> {
    if (process.env.sastTool) {
      core.exportVariable('sastTool', process.env.sastTool);
    } else {
      if (!sastTool || sastTool === 'name-of-tool') {
        core.warning('Sast Tool is not set!');
        return;
      }
      core.exportVariable('sastTool', sastTool);
    }
  }
}
