import * as core from '@actions/core';
import sinon, { SinonStub } from 'sinon';
import { BranchProtectionService } from '../src/branchprotection/BranchProtectionService';

describe('BranchProtectionService', () => {
  let warningStub: SinonStub;
  let noticeStub: SinonStub;
  let infoStub: SinonStub;
  let exportVariableStub: SinonStub;
  let logStub: SinonStub;
  let getBranhcProtectionStub: SinonStub;
  const octokitMock: any = {
    rest: {
      repos: {
        getBranchProtection() {},
      },
    },
  };

  beforeEach(() => {
    warningStub = sinon.stub(core, 'warning');
    noticeStub = sinon.stub(core, 'notice');
    infoStub = sinon.stub(core, 'info');
    exportVariableStub = sinon.stub(core, 'exportVariable');
    logStub = sinon.stub(console, 'log');
    getBranhcProtectionStub = sinon.stub(octokitMock.rest.repos, 'getBranchProtection');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should handle successful branch protection retrieval', async () => {
    getBranhcProtectionStub.returns({
      data: {
        enforce_admins: { enabled: true },
        required_pull_request_reviews: { required_approving_review_count: 1 },
      },
    });

    await BranchProtectionService.getStateOfBranchProtection(octokitMock, 'owner', 'repo');
    sinon.assert.calledOnceWithExactly(exportVariableStub, 'numberOfReviewers', 1);
  });

  it('should warn when admins can bypass branch protection rules', async () => {
    getBranhcProtectionStub.returns({
      data: {
        enforce_admins: { enabled: false },
        required_pull_request_reviews: { required_approving_review_count: 1 },
      },
    });

    await BranchProtectionService.getStateOfBranchProtection(octokitMock, 'owner', 'repo');
    sinon.assert.calledOnce(warningStub);
    sinon.assert.calledOnceWithExactly(exportVariableStub, 'numberOfReviewers', 0);
  });

  it('should handle a 401 error', async () => {
    getBranhcProtectionStub.rejects({
      status: 401,
      message: '401 error message',
    });

    await BranchProtectionService.getStateOfBranchProtection(octokitMock, 'owner', 'repo');
    sinon.assert.calledOnce(warningStub);
    sinon.assert.notCalled(exportVariableStub);
  });

  it('should handle a 404 error (caused by branch protection not enabled)', async () => {
    getBranhcProtectionStub.rejects({
      status: 404,
      message: 'Branch not protected',
    });

    await BranchProtectionService.getStateOfBranchProtection(octokitMock, 'owner', 'repo');
    sinon.assert.calledOnce(noticeStub);
    sinon.assert.calledOnceWithExactly(exportVariableStub, 'numberOfReviewers', 0);
  });

  it('should handle a normal 404 error', async () => {
    getBranhcProtectionStub.rejects({
      status: 404,
      message: 'Regular 404 error message',
    });

    await BranchProtectionService.getStateOfBranchProtection(octokitMock, 'owner', 'repo');
    sinon.assert.calledOnce(warningStub);
    sinon.assert.notCalled(exportVariableStub);
  });

  it('should call warning when branch protection is enabled but receives 404 (status = 404)', async () => {
    getBranhcProtectionStub.rejects({
      status: 500,
      message: 'Default error case',
    });

    await BranchProtectionService.getStateOfBranchProtection(octokitMock, 'owner', 'repo');
    sinon.assert.calledOnce(noticeStub);
    sinon.assert.notCalled(exportVariableStub);
  });
});
