import * as core from '@actions/core';
import * as github from '@actions/github';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import { expect } from 'chai';
import { BranchProtectionService } from '../src/branchprotection/BranchProtectionService';
describe('BranchProtectionService', () => {
  let sandbox: SinonSandbox;
  let warningStub: SinonStub;
  let noticeStub: SinonStub;
  let infoStub: SinonStub;
  let exportVariableStub: SinonStub;
  let getOctokitStub: SinonStub;
  let logStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    warningStub = sandbox.stub(core, 'warning');
    noticeStub = sandbox.stub(core, 'notice');
    infoStub = sandbox.stub(core, 'info');
    exportVariableStub = sandbox.stub(core, 'exportVariable');
    getOctokitStub = sandbox.stub(github, 'getOctokit');
    logStub = sandbox.stub(console, 'log');
    sandbox.stub(github.context, 'repo').value({
      owner: 'owner',
      repo: 'repo',
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should handle successful branch protection retrieval', async () => {
    getOctokitStub.returns({
      rest: {
        repos: {
          getBranchProtection: sinon.stub().resolves({
            data: {
              enforce_admins: { enabled: true },
              required_pull_request_reviews: { required_approving_review_count: 1 },
            },
          }),
        },
      },
    });

    await BranchProtectionService.getStateOfBranchProtection();
    expect(warningStub.called).to.be.false;
    expect(exportVariableStub.calledWith('numberOfReviewers', 1)).to.be.true;
  });
  it('should call warning when admins can bypass branch protection rules', async () => {
    getOctokitStub.returns({
      rest: {
        repos: {
          getBranchProtection: sinon.stub().resolves({
            data: {
              enforce_admins: { enabled: false },
              required_pull_request_reviews: { required_approving_review_count: 1 },
            },
          }),
        },
      },
    });

    await BranchProtectionService.getStateOfBranchProtection();
    expect(warningStub.called).to.be.true;
    expect(exportVariableStub.calledWith('numberOfReviewers', 0)).to.be.true;
  });
  it('should call notice and set numberOfReviewers to 0 when branch protection is not enabled (status = 404)', async () => {
    getOctokitStub.returns({
      rest: {
        repos: {
          getBranchProtection: sinon.stub().rejects({
            status: 404,
            message: 'Branch not protected',
          }),
        },
      },
    });

    await BranchProtectionService.getStateOfBranchProtection();
    expect(noticeStub.called).to.be.true;
    expect(exportVariableStub.calledWith('numberOfReviewers', 0)).to.be.true;
  });
  it('should call warning when branch protection is enabled but receives 404 (status = 404)', async () => {
    getOctokitStub.returns({
      rest: {
        repos: {
          getBranchProtection: sinon.stub().rejects({
            status: 404,
            message: 'Not Found',
          }),
        },
      },
    });

    await BranchProtectionService.getStateOfBranchProtection();
    expect(warningStub.called).to.be.true;
    expect(exportVariableStub.called).to.be.false;
  });
});
