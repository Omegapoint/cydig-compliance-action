import * as core from '@actions/core';
import * as github from '@actions/github';
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    console.log('Custom task is working!');
    const token = core.getInput('repo-token');
    console.log("Got the token");
    const octokit = github.getOctokit(token);
    console.log("octoKit authenticated");
    console.log("Going to get branch protection");
    const { owner, repo } = github.context.repo;
    console.log(`Owner: ${owner}`);
    console.log(`Repo: ${repo}`);
    
    const branchProtection = await octokit.rest.repos.getBranchProtection({
      owner: owner,
      repo: repo,
      branch: 'main',
    }).then((response) => { 
      console.log("Got the branch protection");
      console.log(response.data);
    }).catch((error) => {
      console.log("Error getting branch protection");
      console.log(error);
    });

    // if(!branchProtection){
    //   console.log("Branch protection not found");
    // }
    // else{
    // console.log("Logging branch protection");
    // console.log(branchProtection.data);
    // }

  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
