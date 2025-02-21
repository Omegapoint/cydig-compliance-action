import * as core from '@actions/core';
import { SlackService } from './SlackService';
import { CyDigConfig } from '../types/CyDigConfig';

export class CommunicationService {
    public static async getStateOfCommunication(cydigConfig: CyDigConfig) {
        console.log('--- Communication control ---');
        let communicationTool: string = cydigConfig.communicationTool.nameOfTool;
        if (process.env.communicationTool) {
            communicationTool = process.env.communicationTool;
        }
        if (!communicationTool || communicationTool === '' || communicationTool === 'name-of-tool') {
          core.warning('SAST Tool is not set!');
          return;
        }
        console.log(`Tool:`, `${communicationTool}`);
        switch (communicationTool.toLowerCase()) {
          case 'slack':
            const slackService: SlackService = new SlackService(cydigConfig);
            await slackService.setAccessToSlackChannel()
            break;
          default:
            core.exportVariable('communicationTool', communicationTool);
            break;
        }
        console.log();
      }
}
