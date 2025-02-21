import { Endpoints } from '@octokit/types';

export type DependabotAlertsForRepoResponseDataType =
    Endpoints['GET /repos/{owner}/{repo}/dependabot/alerts']['response'];

export type CodeScanningAlertsForRepoResponseDataType =
    Endpoints['GET /repos/{owner}/{repo}/code-scanning/alerts']['response'];

export type SecretAlertsForRepoResponseDataType =
    Endpoints['GET /repos/{owner}/{repo}/secret-scanning/alerts']['response'];

export type BranchProtectionForRepoResponseDataType =
    Endpoints['GET /repos/{owner}/{repo}/branches/{branch}/protection']['response'];
