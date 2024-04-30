import * as core from '@actions/core';
import sinon, { SinonStub } from 'sinon';
import { CodeQLService } from '../src/sasttools/CodeQLService';

describe('CodeQLService', () => {
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

  it('should handle successful code scanning retrieval', async () => {
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

    await CodeQLService.setCodeQLFindings(octokitMock, 'owner', 'repo');
    sinon.assert.callCount(exportVariableStub, 4);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity1', 1);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity2', 1);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity3', 1);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity4', 1);
    sinon.assert.notCalled(warningStub);
  });

  it('should handle a 401 error', async () => {
    iteratorStub.throws({
      status: 401,
      message: '401 error message',
    });

    await CodeQLService.setCodeQLFindings(octokitMock, 'owner', 'repo');
    sinon.assert.calledOnce(warningStub);
    sinon.assert.callCount(exportVariableStub, 4);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity1', 0);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity2', 0);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity3', 0);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity4', 0);
  });

  it('should handle a 403 error', async () => {
    iteratorStub.throws({
      status: 403,
      message: '403 error message',
    });

    await CodeQLService.setCodeQLFindings(octokitMock, 'owner', 'repo');
    sinon.assert.calledOnce(warningStub);
    sinon.assert.callCount(exportVariableStub, 4);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity1', 0);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity2', 0);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity3', 0);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity4', 0);
  });

  it('should handle a normal 404 error', async () => {
    iteratorStub.throws({
      status: 404,
      message: '404 error message',
    });

    await CodeQLService.setCodeQLFindings(octokitMock, 'owner', 'repo');
    sinon.assert.calledOnce(warningStub);
    sinon.assert.callCount(exportVariableStub, 4);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity1', 0);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity2', 0);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity3', 0);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity4', 0);
  });

  it('should handle error other than 401, 403, 404', async () => {
    iteratorStub.throws({
      status: 500,
      message: 'Default error case',
    });

    await CodeQLService.setCodeQLFindings(octokitMock, 'owner', 'repo');
    sinon.assert.calledOnce(noticeStub);
    sinon.assert.callCount(exportVariableStub, 4);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity1', 0);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity2', 0);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity3', 0);
    sinon.assert.calledWithExactly(exportVariableStub, 'SASTnumberOfSeverity4', 0);
    sinon.assert.notCalled(warningStub);
  });
});
