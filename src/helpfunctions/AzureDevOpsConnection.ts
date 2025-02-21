import * as nodeApi from 'azure-devops-node-api';
import { IRequestHandler } from 'azure-devops-node-api/interfaces/common/VsoBaseInterfaces';

export class AzureDevOpsConnection {
    private accessToken: string;
    private orgUrlDevOps: string;
    private orgName: string;

    constructor(orgName: string, accessToken: string) {
        this.accessToken = this.isNullOrUndefined(accessToken);
        this.orgName = orgName;
        this.orgUrlDevOps = `https://dev.azure.com/${orgName}/`;
    }

    private isNullOrUndefined(value: string): string {
        if (!value) {
            throw new Error('Input values cannot be null or undefined');
        }
        return value;
    }

    public getConnection(): nodeApi.WebApi {
        const authHandler: IRequestHandler = nodeApi.getPersonalAccessTokenHandler(this.accessToken);
        const connection: nodeApi.WebApi = new nodeApi.WebApi(this.orgUrlDevOps, authHandler);
        return connection;
    }

    public getOrgName(): string {
        return this.orgName;
    }
}
