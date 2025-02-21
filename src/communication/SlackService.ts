import { ConversationsInfoResponse, ConversationsListResponse, WebClient } from '@slack/web-api';
import * as core from '@actions/core';
import { CyDigConfig } from '../types/CyDigConfig';

export class SlackService {
    private cydigConfig: CyDigConfig;

    constructor(cydigConfig: CyDigConfig) {
      this.cydigConfig = cydigConfig;
    }

    public async setAccessToSlackChannel() {
        console.log('\n Running Slack control');
        const accessToken: string = core.getInput('slackAccessToken')
        const webClient: WebClient = new WebClient(accessToken);
        const numberOfSlackChannelMembers: string = await this.getNumberOfSlackChannelMembers(webClient, this.cydigConfig.communicationTool.slack.channelName);

        console.log('Number of Slack channel members: ', numberOfSlackChannelMembers);
        core.exportVariable('numberOfCommunicationMembers', numberOfSlackChannelMembers);
        core.exportVariable('communicationTool', 'Slack');
        return;
    }

    private async getNumberOfSlackChannelMembers(webClient: WebClient, channelName: string): Promise<string> {
        const slackChannelId: string = await this.getSlackChannelId(webClient, channelName);

        try {
          const response: ConversationsInfoResponse = await webClient.conversations.info({
            channel: slackChannelId,
            include_num_members: true
          });

          if (!response.ok) {
            throw new Error(`${response.error}`);
          }
          if(response.channel && response.channel.num_members) {
          // Number of slack channel members - 1 to remove the Slack app from the count
          return this.cydigConfig.communicationTool.slack.isPrivate
            ? String(response.channel.num_members - 1)
            : response.channel.num_members.toString();
          } else {
            throw new Error(`Cannot find channel or members of channel`);
          }
        } catch (error) {
          throw new Error(error);
        }
      }

    private async getSlackChannelId(webClient: WebClient, channelName: string): Promise<string> {
        const channelType: string = this.cydigConfig.communicationTool.slack.isPrivate
          ? 'private_channel'
          : 'public_channel';
        try {
          const response: ConversationsListResponse = await webClient.conversations.list({
            exclude_archived: true,
            types: channelType
          });

          if (response.ok) {
            const channels: Array<{ id: string; name: string }> = response.channels as Array<{ id: string; name: string }>;
            const channel: { id: string; name: string } | undefined = channels.find(
              (c: { id: string; name: string }) => c.name === channelName
            );

            if (!channel) {
              throw new Error('Slack channel could not be found');
            }
            return channel.id;
          } else {
            throw new Error(`${response.error}`);
          }
        } catch (error) {
          throw new Error(error);
        }
      }
}
