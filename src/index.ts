import * as core from '@actions/core';
import * as github from '@actions/github';
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    console.log('Custom task is working!');

    const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
    const { owner, repo } = github.context.repo;
    const branchProtection = await octokit.rest.repos.getBranchProtection({
      owner: owner,
      repo: repo,
      branch: 'main',
    });
 console.log(branchProtection.data);

  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
