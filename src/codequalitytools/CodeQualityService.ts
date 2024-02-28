import * as core from '@actions/core';

export class CodeQualityService {
  public static async getStateOfCodeQualityTool(codeQualityTool: string): Promise<void> {
    if (process.env.codeQualityTool) {
      core.exportVariable('codeQualityTool', process.env.codeQualityTool);
    } else {
      if (codeQualityTool === 'name-of-tool') {
        core.warning('Code Quality Tool is not set!');
        return;
      }
      core.exportVariable('codeQualityTool', codeQualityTool);
    }
  }
}
