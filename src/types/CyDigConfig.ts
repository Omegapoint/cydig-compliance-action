export type CyDigConfig = {
  teamName: string;
  usingAzure: boolean;
  threatModeling: {
    date: string;
    boardsTag: string;
  };
  pentest: {
    date: string;
    boardsTag: string;
  };
  azureDevOps: {
    usingBoards: boolean
    boards: {
      organizationName: string;
      projectName: string;
      nameOfBoard: string;
    }
  }
  scaTool: string;
  sastTool: string;
  codeQualityTool: string;
};
