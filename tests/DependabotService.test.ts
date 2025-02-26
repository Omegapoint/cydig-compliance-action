import * as core from '@actions/core';
import sinon, { SinonStub } from 'sinon';
import { DependabotService } from '../src/scatools/DependabotService';
import GitHub_Tools from '../src/types/GitHubTools';

describe('CodeQLService', function () {
    let warningStub: SinonStub;
    let noticeStub: SinonStub;
    let infoStub: SinonStub;
    let exportVariableStub: SinonStub;
    let logStub: SinonStub;
    let iteratorStub: SinonStub;
    const octokitMock: any = {
        paginate: {
            iterator() {
                return;
            },
        },
        dependabot: {
            listAlertsForRepo: '',
        },
    };

    beforeEach(function () {
        warningStub = sinon.stub(core, 'warning');
        noticeStub = sinon.stub(core, 'notice');
        infoStub = sinon.stub(core, 'info');
        exportVariableStub = sinon.stub(core, 'exportVariable');
        logStub = sinon.stub(console, 'log');
        iteratorStub = sinon.stub(octokitMock.paginate, 'iterator');
    });

    afterEach(function () {
        sinon.restore();
    });

    it('should handle successful Dependabot alerts retrieval', async function () {
        iteratorStub.returns([
            {
                data: [
                    {
                        security_vulnerability: {
                            severity: 'low',
                        },
                    },
                    {
                        security_vulnerability: {
                            severity: 'medium',
                        },
                    },
                    {
                        security_vulnerability: {
                            severity: 'high',
                        },
                    },
                    {
                        security_vulnerability: {
                            severity: 'critical',
                        },
                    },
                ],
            },
        ]);

        await DependabotService.setDependabotFindings(GitHub_Tools.DEPENDABOT, octokitMock, 'owner', 'repo');
        sinon.assert.callCount(exportVariableStub, 5);
        sinon.assert.calledWithExactly(exportVariableStub, 'scaTool', GitHub_Tools.DEPENDABOT);
        sinon.assert.calledWithExactly(exportVariableStub, 'SCAnumberOfSeverity1', 1);
        sinon.assert.calledWithExactly(exportVariableStub, 'SCAnumberOfSeverity1', 1);
        sinon.assert.calledWithExactly(exportVariableStub, 'SCAnumberOfSeverity1', 1);
        sinon.assert.calledWithExactly(exportVariableStub, 'SCAnumberOfSeverity1', 1);
        sinon.assert.notCalled(warningStub);
    });

    it('should handle a 401 error', async function () {
        iteratorStub.throws({
            status: 401,
            message: '401 error message',
        });

        await DependabotService.setDependabotFindings(GitHub_Tools.DEPENDABOT, octokitMock, 'owner', 'repo');
        sinon.assert.calledOnce(warningStub);
    });

    it('should handle a 403 error', async function () {
        iteratorStub.throws({
            status: 403,
            message: '403 error message',
        });

        await DependabotService.setDependabotFindings(GitHub_Tools.DEPENDABOT, octokitMock, 'owner', 'repo');
        sinon.assert.calledOnce(warningStub);
    });

    it('should handle a 404 error', async function () {
        iteratorStub.throws({
            status: 404,
            message: '404 error message',
        });

        await DependabotService.setDependabotFindings(GitHub_Tools.DEPENDABOT, octokitMock, 'owner', 'repo');
        sinon.assert.calledOnce(warningStub);
    });

    it('should handle error other than 401, 403, 404', async function () {
        iteratorStub.throws({
            status: 500,
            message: 'Default error case',
        });

        await DependabotService.setDependabotFindings(GitHub_Tools.DEPENDABOT, octokitMock, 'owner', 'repo');
        sinon.assert.calledOnce(noticeStub);
        sinon.assert.notCalled(warningStub);
    });
});
