export type CyDigConfig = {
  teamName: string;
  usingAzure: boolean;
  threatModeling: {
    date: string;
    boardsTag: string;
  };
  secretScanningTool: {
    nameOfTool: string;
  };
  pentest: {
    date: string;
    boardsTag: string;
  };
  azureDevOps: {
    usingBoards: boolean;
    boards: {
      organizationName: string;
      projectName: string;
      nameOfBoard: string;
    };
  };
  scaTool: {
    nameOfTool: string;
  };
  sastTool: {
    nameOfTool: string;
  };
  codeQualityTool: {
    nameOfTool: string;
  };
  communicationTool: {
    nameOfTool: string;
    slack: {
      channelName: string;
      isPrivate: boolean;
    }
  };
};
