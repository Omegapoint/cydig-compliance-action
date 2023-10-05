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
    usingAzure: Joi.boolean(),
    threatModeling: Joi.object({
      date: Joi.string(),
      boardsTag: Joi.string(),
    }),
    pentest: Joi.object({
      date: Joi.string(),
      boardsTag: Joi.string(),
    }),
    github: Joi.object({
      usingRepos: Joi.boolean(),
      repos: Joi.object({
        username: Joi.string(),
      }),
      usingBoards: Joi.boolean(),
      boards: Joi.object({
        nameOfBoard: Joi.string(),
      }),
    }),
    scaTool: Joi.object({
      nameOfTool: Joi.string(),
      owaspDependencyCheck: Joi.object({
        reportPath: Joi.string(),
        csvPath: Joi.string().optional(),
      }),
    }),
    sastTool: Joi.object({
      nameOfTool: Joi.string(),
      semgrep: Joi.object({
        reportPath: Joi.string(),
      }),
    }),
    codeQualityTool: Joi.object({
      nameOfTool: Joi.string(),
    }),
    reposToExclude: Joi.object({
      nameOfRepos: Joi.string().optional(),
    }),
  });

  if (schema.validate(config).error) {
    throw new Error(`${schema.validate(config).error?.message} in your CyDig Config file`);
  }
}
