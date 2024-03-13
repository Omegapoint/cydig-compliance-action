import { WebApi } from 'azure-devops-node-api';
import { WorkItem, WorkItemQueryResult, WorkItemReference } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import { IWorkItemTrackingApi } from 'azure-devops-node-api/WorkItemTrackingApi';

export class ThreatModelingTicketService {
  private connection: WebApi;
  private projectId: string;
  private tag: string;

  constructor(azureDevOpsConnection: WebApi, projectId: string, tag: string) {
    this.connection = azureDevOpsConnection;
    this.projectId = projectId;
    this.tag = this.setTag(tag);
  }

  private setTag(tag: string): string {
    if (!tag || tag === 'not specified') {
      return 'TM';
    }
    return tag;
  }

  public async getThreatModelingTickets(nameOfBoards: string): Promise<{
    numberOfActiveTickets: number;
    numberOfClosedTickets: number;
  }> {
    const areaPaths: string[] = await this.getAreaPaths(nameOfBoards);
    const workItems: WorkItemReference[] = await this.getWorkItems(areaPaths);
    const numberOfTickets: {
      numberOfActiveTickets: number;
      numberOfClosedTickets: number;
    } = await this.getNumberOfActiveAndClosedTickets(workItems);
    return numberOfTickets;
  }

  private async getAreaPaths(nameOfBoards: string): Promise<string[]> {
    if (!nameOfBoards || nameOfBoards.toLocaleLowerCase() === null || nameOfBoards === 'not specified') {
      console.log('No board specified, looking through all boards in project');
      return [];
    }

    let nameOfBoardsArray: string[] = [];
    if (nameOfBoards.length > 0) {
      nameOfBoardsArray = nameOfBoards.split(', ');
      console.log(`Boards: ${nameOfBoardsArray}`);
    }

    const areaPaths: string[] = [];
    for (const board of nameOfBoardsArray) {
      const areaPath: string | undefined = (
        await (
          await this.connection.getWorkApi()
        ).getTeamFieldValues({
          team: board,
          project: this.projectId,
        })
      ).defaultValue;

      if (areaPath) {
        areaPaths.push(areaPath);
      }
    }

    if (areaPaths.length == 0) {
      throw new Error('Found no board with the specified name');
    }

    return areaPaths;
  }

  private async getWorkItems(areaPaths: string[]): Promise<WorkItemReference[]> {
    const witApi: IWorkItemTrackingApi = await this.connection.getWorkItemTrackingApi();
    let queryStringAreaPath: string = '';
    if (areaPaths.length > 0) {
      queryStringAreaPath = this.getQueryStringAreaPath(areaPaths);
    }

    const workItemsResponse: WorkItemQueryResult = await witApi.queryByWiql({
      query: `SELECT [System.Id] FROM WorkItems WHERE ${queryStringAreaPath} [System.TeamProject] = '${this.projectId}' AND [System.Tags] CONTAINS '${this.tag}'`,
    });

    const workItems: WorkItemReference[] | undefined = workItemsResponse.workItems;

    return workItems!;
  }

  private getQueryStringAreaPath(areaPaths: string[]): string {
    let queryStringAreaPath: string = '(';
    areaPaths.forEach((areaPath: string) => {
      if (areaPath === areaPaths[areaPaths.length - 1]) {
        queryStringAreaPath = queryStringAreaPath.concat(`[System.AreaPath] = '${areaPath}') AND`);
      } else {
        queryStringAreaPath = queryStringAreaPath.concat(`[System.AreaPath] = '${areaPath}' OR `);
      }
    });
    return queryStringAreaPath;
  }

  private async getNumberOfActiveAndClosedTickets(workItems: WorkItemReference[]): Promise<{
    numberOfActiveTickets: number;
    numberOfClosedTickets: number;
  }> {
    const witApi: IWorkItemTrackingApi = await this.connection.getWorkItemTrackingApi();
    let numberOfClosedTickets: number = 0;
    let numberOfActiveTickets: number = 0;

    for (const workItem of workItems) {
      const workItemFetched: WorkItem = await witApi.getWorkItem(workItem.id!);
      const state: string = await workItemFetched.fields!['System.State'];
      if (state === 'Closed' || state === 'Done') {
        numberOfClosedTickets++;
      } else {
        numberOfActiveTickets++;
      }
    }
    return {
      numberOfActiveTickets: numberOfActiveTickets,
      numberOfClosedTickets: numberOfClosedTickets,
    };
  }
}
