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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = exports.getContentOfFile = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const joi_1 = __importDefault(require("joi"));
function getContentOfFile(jsonPath) {
    const jsonFilePath = path.resolve(__dirname, path.relative(__dirname, path.normalize(jsonPath).replace(/^(\.\.(\/|\\|$))+/, '')));
    const fileContent = fs.readFileSync(jsonFilePath, { encoding: 'utf-8' });
    const cydigConfig = JSON.parse(fileContent);
    validateConfig(cydigConfig);
    return cydigConfig;
}
exports.getContentOfFile = getContentOfFile;
function validateConfig(config) {
    const schema = joi_1.default.object({
        teamName: joi_1.default.string().required(),
        usingAzure: joi_1.default.boolean().required(),
        threatModeling: joi_1.default.object({
            date: joi_1.default.string().required(),
            boardsTag: joi_1.default.string().required(),
        }).required(),
        pentest: joi_1.default.object({
            date: joi_1.default.string().required(),
            boardsTag: joi_1.default.string().required(),
        }).required(),
        github: joi_1.default.object({
            usingRepos: joi_1.default.boolean().required(),
            repos: joi_1.default.object({
                username: joi_1.default.string().required(),
            }).required(),
            usingBoards: joi_1.default.boolean().required(),
            boards: joi_1.default.object({
                nameOfBoard: joi_1.default.string().required(),
            }).required(),
        }).required(),
        scaTool: joi_1.default.object({
            nameOfTool: joi_1.default.string().required(),
            owaspDependencyCheck: joi_1.default.object({
                reportPath: joi_1.default.string().required(),
                csvPath: joi_1.default.string().optional(),
            }),
        }).required(),
        sastTool: joi_1.default.object({
            nameOfTool: joi_1.default.string().required(),
            semgrep: joi_1.default.object({
                reportPath: joi_1.default.string().required(),
            }).required(),
        }).required(),
        codeQualityTool: joi_1.default.object({
            nameOfTool: joi_1.default.string().required(),
        }).required(),
        reposToExclude: joi_1.default.object({
            nameOfRepos: joi_1.default.string().optional(),
        }),
    });
    if (schema.validate(config).error) {
        throw new Error(`${schema.validate(config).error.message} in your CyDig Config file`);
    }
}
exports.validateConfig = validateConfig;
//# sourceMappingURL=JsonService.js.map