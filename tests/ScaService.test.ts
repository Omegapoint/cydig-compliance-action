import * as core from '@actions/core';
import sinon, { SinonStub } from 'sinon';
import { DependabotService } from '../src/scatools/DependabotService';
import { ScaService } from '../src/scatools/ScaService';
import GitHub_Tools from '../src/types/GitHubTools';

describe('DependabotService', function () {
    let warningStub: SinonStub;
    let noticeStub: SinonStub;
    let infoStub: SinonStub;
    let exportVariableStub: SinonStub;
    let logStub: SinonStub;
    let setDependabotFindingsStub: SinonStub;
    const octokitMock: any = {};

    beforeEach(function () {
        warningStub = sinon.stub(core, 'warning');
        noticeStub = sinon.stub(core, 'notice');
        infoStub = sinon.stub(core, 'info');
        exportVariableStub = sinon.stub(core, 'exportVariable');
        logStub = sinon.stub(console, 'log');
        setDependabotFindingsStub = sinon.stub(DependabotService, 'setDependabotFindings');
    });

    afterEach(function () {
        sinon.restore();
    });

    it('should run Dependabot suite if toolName is "Dependabot"', async function () {
        await ScaService.getStateOfScaTool(GitHub_Tools.DEPENDABOT, octokitMock, 'owner', 'repo');
        sinon.assert.calledOnce(setDependabotFindingsStub);
    });

    it('should only export variable "scaTool" if tool is not supported', async function () {
        await ScaService.getStateOfScaTool('unsupported tool', octokitMock, 'owner', 'repo');
        sinon.assert.calledOnceWithExactly(exportVariableStub, 'scaTool', 'unsupported tool');
    });
});
