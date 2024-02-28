import * as core from '@actions/core';

export class CodeQualityService {
  public static async getStateOfCodeQualityTool(codeQualityTool: string): Promise<void> {
    console.log('\n Running Code Quality control');
    if (process.env.codeQualityTool) {
      console.log(`Code Quality Tool: ${process.env.codeQualityTool}`);
      core.exportVariable('codeQualityTool', process.env.codeQualityTool);
    } else {
      if (!codeQualityTool || codeQualityTool === 'name-of-tool') {
        core.warning('Code Quality Tool is not set!');
        return;
      }
      console.log(`Code Quality Tool: ${codeQualityTool}`);
      core.exportVariable('codeQualityTool', codeQualityTool);
    }
  }
}
