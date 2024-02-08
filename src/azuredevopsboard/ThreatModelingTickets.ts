import * as core from '@actions/core';
import { AzureDevOpsConnection } from '../helpfunctions/AzureDevOpsConnection';
import { ThreatModelingTicketService } from './ThreatModelingTicketService';
import { DevOpsBoard } from '../types/DevOpsBoard';

export class ThreatModelingTickets {
  static async setThreatModelingTickets(
    azureDevOpsConnection: AzureDevOpsConnection,
    board: DevOpsBoard
  ): Promise<void> {
    console.log('Getting threat modeling tickets');
    const threatModelingTicketService: ThreatModelingTicketService = new ThreatModelingTicketService(
      azureDevOpsConnection.getConnection(),
      board.projectId,
      board.threatModelingTag
    );
    const numberOfTickets: {
      numberOfActiveTickets: number;
      numberOfClosedTickets: number;
    } = await threatModelingTicketService.getThreatModelingTickets(board.nameOfBoards);

    console.log('Active threat modeling tickets: ' + numberOfTickets.numberOfActiveTickets);
    console.log('Closed threat modeling tickets : ' + numberOfTickets.numberOfClosedTickets);

    core.exportVariable('tmNumberOfActiveTickets', numberOfTickets.numberOfActiveTickets.toString());
    core.exportVariable('tmNumberOfClosedTickets', numberOfTickets.numberOfClosedTickets.toString());
    return;
  }
}
