import * as core from '@actions/core';
import sinon, { SinonStub } from 'sinon';
import { CodeQLService } from '../src/sasttools/CodeQLService';
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
        codeScanning: {
            listAlertsForRepo: '',
        },
    };

    beforeEach(() => {
        warningStub = sinon.stub(core, 'warning');
        noticeStub = sinon.stub(core, 'notice');
        infoStub = sinon.stub(core, 'info');
        exportVariableStub = sinon.stub(core, 'exportVariable');
        logStub = sinon.stub(console, 'log');
        iteratorStub = sinon.stub(octokitMock.paginate, 'iterator');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should handle successful code scanning retrieval', async function () {
        iteratorStub.returns([
            {
                data: [
                    {
                        rule: {
                            security_severity_level: 'low',
                        },
                    },
                    {
                        rule: {
                            security_severity_level: 'medium',
                        },
                    },
                    {
                        rule: {
                            security_severity_level: 'high',
                        },
                    },
                    {
                        rule: {
                            security_severity_level: 'critical',
                        },
                    },
                ],
            },
        ]);

        await CodeQLService.setCodeQLFindings(GitHub_Tools.CODEQL, octokitMock, 'owner', 'repo');
        sinon.assert.callCount(exportVariableStub, 5);
        sinon.assert.calledWithExactly(exportVariableStub, 'sastTool', GitHub_Tools.CODEQL);
        sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity1', 1);
        sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity2', 1);
        sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity3', 1);
        sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity4', 1);
        sinon.assert.notCalled(warningStub);
    });

    it('should handle a 401 error', async function () {
        iteratorStub.throws({
            status: 401,
            message: '401 error message',
        });

        await CodeQLService.setCodeQLFindings(GitHub_Tools.CODEQL, octokitMock, 'owner', 'repo');
        sinon.assert.calledOnce(warningStub);
    });

    it('should handle a 403 error', async function () {
        iteratorStub.throws({
            status: 403,
            message: '403 error message',
        });

        await CodeQLService.setCodeQLFindings(GitHub_Tools.CODEQL, octokitMock, 'owner', 'repo');
        sinon.assert.calledOnce(warningStub);
    });

    it('should handle a 404 error', async function () {
        iteratorStub.throws({
            status: 404,
            message: '404 error message',
        });

        await CodeQLService.setCodeQLFindings(GitHub_Tools.CODEQL, octokitMock, 'owner', 'repo');
        sinon.assert.calledOnce(warningStub);
    });

    it('should handle error other than 401, 403, 404', async function () {
        iteratorStub.throws({
            status: 500,
            message: 'Default error case',
        });

        await CodeQLService.setCodeQLFindings(GitHub_Tools.CODEQL, octokitMock, 'owner', 'repo');
        sinon.assert.calledOnce(noticeStub);
        sinon.assert.notCalled(warningStub);
    });
});
