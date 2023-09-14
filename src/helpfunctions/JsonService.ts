import * as fs from 'fs';
import * as path from 'path';
import { CyDigConfig } from '../types/CyDigConfig';
import Joi from 'joi';

export function getContentOfFile(jsonPath: string): CyDigConfig {
  const jsonFilePath: string = path.resolve(
    __dirname,
    path.relative(__dirname, path.normalize(jsonPath).replace(/^(\.\.(\/|\\|$))+/, ''))
  );
  const fileContent: string = fs.readFileSync(jsonFilePath, { encoding: 'utf-8' });

  const cydigConfig: CyDigConfig = JSON.parse(fileContent);

  validateConfig(cydigConfig);

  return cydigConfig;
}

export function validateConfig(config: unknown): void {
  const schema: Joi.ObjectSchema<CyDigConfig> = Joi.object({
    teamName: Joi.string().required(),
    usingAzure: Joi.boolean().required(),
    threatModeling: Joi.object({
      date: Joi.string().required(),
      boardsTag: Joi.string().required(),
    }).required(),
    pentest: Joi.object({
      date: Joi.string().required(),
      boardsTag: Joi.string().required(),
    }).required(),
    github: Joi.object({
      usingRepos: Joi.boolean().required(),
      repos: Joi.object({
        username: Joi.string().required(),
      }).required(),
      usingBoards: Joi.boolean().required(),
      boards: Joi.object({
        nameOfBoard: Joi.string().required(),
      }).required(),
    }).required(),
    scaTool: Joi.object({
      nameOfTool: Joi.string().required(),
      owaspDependencyCheck: Joi.object({
        reportPath: Joi.string().required(),
        csvPath: Joi.string().optional(),
      }),
    }).required(),
    sastTool: Joi.object({
      nameOfTool: Joi.string().required(),
      semgrep: Joi.object({
        reportPath: Joi.string().required(),
      }).required(),
    }).required(),
    codeQualityTool: Joi.object({
      nameOfTool: Joi.string().required(),
    }).required(),
    reposToExclude: Joi.object({
      nameOfRepos: Joi.string().optional(),
    }),
  });

  if (schema.validate(config).error) {
    throw new Error(`${schema.validate(config).error.message} in your CyDig Config file`);
  }
}
