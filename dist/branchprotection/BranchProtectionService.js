"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchProtectionService = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
class BranchProtectionService {
    static async getStateOfBranchProtection() {
        console.log('\n Running branch protection control');
        //numberOfReviewers > 0, if state of branch protection changes
        let numberOfReviewers = 0;
        const token = core.getInput('repo-token');
        const octokit = github.getOctokit(token);
        const { owner, repo } = github.context.repo;
        await octokit.rest.repos
            .getBranchProtection({
            owner: owner,
            repo: repo,
            branch: 'main',
        })
            .then((response) => {
            console.log(response.data);
        })
            .catch((error) => {
            console.log('Branch protections is not enabled for repository: ' + repo);
        });
        core.exportVariable('numberOfReviewers', numberOfReviewers);
    }
}
exports.BranchProtectionService = BranchProtectionService;
//# sourceMappingURL=BranchProtectionService.js.map