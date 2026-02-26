import mockRequire from 'mock-require';
import sinon, { SinonStub } from 'sinon';
import GitHub_Tools from '../src/types/GitHubTools';

const core = {
    warning: (): void => undefined,
    notice: (): void => undefined,
    info: (): void => undefined,
    exportVariable: (): void => undefined,
};

mockRequire('@actions/core', core);

const { CodeQLService } = require('../src/sasttools/CodeQLService');
const { SastService } = require('../src/sasttools/SastService');

describe('SastService', function () {
    let warningStub: SinonStub;
    let noticeStub: SinonStub;
    let infoStub: SinonStub;
    let exportVariableStub: SinonStub;
    let logStub: SinonStub;
    let setCodeQLFindingsStub: SinonStub;
    const octokitMock: any = {};

    beforeEach(function () {
        warningStub = sinon.stub(core, 'warning');
        noticeStub = sinon.stub(core, 'notice');
        infoStub = sinon.stub(core, 'info');
        exportVariableStub = sinon.stub(core, 'exportVariable');
        logStub = sinon.stub(console, 'log');
        setCodeQLFindingsStub = sinon.stub(CodeQLService, 'setCodeQLFindings');
    });

    afterEach(function () {
        sinon.restore();
    });

    it('should run CodeQL suite if toolName is "CodeQl"', async function () {
        await SastService.getStateOfSastTool(GitHub_Tools.CODEQL, octokitMock, 'owner', 'repo');
        sinon.assert.calledOnce(setCodeQLFindingsStub);
    });

    it('should only export variable "sastTool" if tool is not supported', async function () {
        await SastService.getStateOfSastTool('unsupported tool', octokitMock, 'owner', 'repo');
        sinon.assert.calledOnceWithExactly(exportVariableStub, 'sastTool', 'unsupported tool');
    });
});
