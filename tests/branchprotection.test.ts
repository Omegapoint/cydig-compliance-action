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
    getInputStub.withArgs('PAT-token').returns('your-pat-token'); // Replace with your token

    getOctokitStub.returns({
      rest: {
        repos: {
          getBranchProtection: sinon.stub().resolves({
            data: {
              enforce_admins: { enabled: true },
              required_pull_request_reviews: { required_approving_review_count: 2 },
            },
          }),
        },
      },
    });

    await BranchProtectionService.getStateOfBranchProtection();

    expect(getInputStub.calledWith('PAT-token')).to.be.true;
    expect(warningStub.called).to.be.false;
    expect(exportVariableStub.calledWith('numberOfReviewers', 2)).to.be.true;
  });

  // Add more test cases for different scenarios as needed
});
