import * as core from '@actions/core';
import { AzureDevOpsConnection } from '../helpfunctions/AzureDevOpsConnection';
import { CyDigConfig } from '../types/CyDigConfig';
import { DevOpsBoard } from '../types/DevOpsBoard';
import { PentestTickets } from './PentestTickets';
import { ThreatModelingTickets } from './ThreatModelingTickets';

export class AzureDevOpsBoardService {
    public static async getStateOfAzureDevOpsBoards(cydigConfig: CyDigConfig): Promise<void> {
        if (cydigConfig.azureDevOps.boards) {
            try {
                console.log('--- Azure DevOps Boards control ---');
                const azureDevOpsConnection: AzureDevOpsConnection = new AzureDevOpsConnection(
                    cydigConfig.azureDevOps.boards.organizationName,
                    core.getInput('accessTokenAzureDevOps'),
                );

                const pentestTagInput: string | undefined = process.env.pentestTag;
                const threatModelingTagInput: string | undefined = process.env.threatModelingTag;

                let pentestTag: string = cydigConfig.pentest.boardsTag;
                if (pentestTagInput !== undefined && pentestTagInput !== '') {
                    pentestTag = pentestTagInput;
                }

                let threatModelingTag: string = cydigConfig.threatModeling.boardsTag;
                if (threatModelingTagInput !== undefined && threatModelingTagInput !== '') {
                    threatModelingTag = threatModelingTagInput;
                }

                const board: DevOpsBoard = {
                    nameOfBoards: cydigConfig.azureDevOps.boards.nameOfBoard,
                    pentestTag: pentestTag,
                    threatModelingTag: threatModelingTag,
                    projectId: cydigConfig.azureDevOps.boards.projectName,
                };

                if (process.env.pentestDate && process.env.pentestDate != 'not specified') {
                    await PentestTickets.setPentestTickets(azureDevOpsConnection, board);
                }

                if (process.env.threatModelingDate && process.env.threatModelingDate != 'not specified') {
                    await ThreatModelingTickets.setThreatModelingTickets(azureDevOpsConnection, board);
                }
            } catch (error) {
                core.warning('Error getting tickets for Azure DevOps Board!');
                console.log(
                    'There is probably somethine wrong with your token, check that it has not expired or been revoked. Please check that you have the correct permissions (Work items: Read)',
                );
                console.log(error)
            }
            console.log();
        }
    }
}
