import * as core from '@actions/core';
import * as github from '@actions/github';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import { expect } from 'chai';
import { BranchProtectionService } from '../src/branchprotection/BranchProtectionService';
describe('BranchProtectionService', () => {
  let sandbox: SinonSandbox;
  let getInputStub: SinonStub;
  let warningStub: SinonStub;
  let exportVariableStub: SinonStub;
  let getOctokitStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    getInputStub = sandbox.stub(core, 'getInput');
    warningStub = sandbox.stub(core, 'warning');
    exportVariableStub = sandbox.stub(core, 'exportVariable');
    getOctokitStub = sandbox.stub(github, 'getOctokit');
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

    expect(getInputStub.returns('PAT-token')).to.not.be.empty;
    expect(warningStub.called).to.be.false;
    expect(exportVariableStub.calledWith('numberOfReviewers', 1)).to.be.true;
  });
  it('should call warning when admins can byypass branch protection rules', async () => {
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
  it('should call warning and set numberOfReviewers to 0 when github repo is private (status = 403)', async () => {
    getOctokitStub.returns({
      rest: {
        repos: {
          getBranchProtection: sinon.stub().rejects({
            status: 403,
            message: 'Forbidden',
          }),
        },
      },
    });

    await BranchProtectionService.getStateOfBranchProtection();

    expect(warningStub.called).to.be.true;
    expect(exportVariableStub.calledWith('numberOfReviewers', 0)).to.be.true;
  });
  // Add more test cases for different scenarios as needed
});
