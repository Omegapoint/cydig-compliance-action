[![OP Compliance Dashboard](https://img.shields.io/badge/OP%20Compliance%20Dashboard-click%20here-blue)](https://cydig.omegapoint.cloud/cydig)<br/><br/>
![Timestamp](https://img.shields.io/endpoint?url=https%3A%2F%2Ffunc-cydig-comp-state-prod.azurewebsites.net%2Fapi%2FReadToReadme%3Fcode%3DxaEvCDsaK01y2Z6SBivwOKndN4o915lpOTt1VkmULgsxgsjkml7u1DOhgULzmAPX%26teamName%3DCyDig%26teamProjectName%3DCyDig%26codeRepositoryName%3Dcydig-compliance-action%26stateType%3Dtimestamp)<br/><br/>
![threatModelingDate](https://img.shields.io/endpoint?url=https%3A%2F%2Ffunc-cydig-comp-state-prod.azurewebsites.net%2Fapi%2FReadToReadme%3Fcode%3DxaEvCDsaK01y2Z6SBivwOKndN4o915lpOTt1VkmULgsxgsjkml7u1DOhgULzmAPX%26teamName%3DCyDig%26teamProjectName%3DCyDig%26codeRepositoryName%3Dcydig-compliance-action%26stateType%3DthreatModelingDate)<br/>
![numberOfReviewers](https://img.shields.io/endpoint?url=https%3A%2F%2Ffunc-cydig-comp-state-prod.azurewebsites.net%2Fapi%2FReadToReadme%3Fcode%3DxaEvCDsaK01y2Z6SBivwOKndN4o915lpOTt1VkmULgsxgsjkml7u1DOhgULzmAPX%26teamName%3DCyDig%26teamProjectName%3DCyDig%26codeRepositoryName%3Dcydig-compliance-action%26stateType%3DnumberOfReviewers)<br/>
[![secureScore](https://img.shields.io/endpoint?url=https%3A%2F%2Ffunc-cydig-comp-state-prod.azurewebsites.net%2Fapi%2FReadToReadme%3Fcode%3DxaEvCDsaK01y2Z6SBivwOKndN4o915lpOTt1VkmULgsxgsjkml7u1DOhgULzmAPX%26teamName%3DCyDig%26teamProjectName%3DCyDig%26codeRepositoryName%3Dcydig-compliance-action%26stateType%3DsecureScore)](https://portal.azure.com/#view/Microsoft_Azure_Security/RecommendationsBladeV2/subscriptionIds~/%5B%2215c6235f-9e0f-4073-baf4-4fd0a7913d76%22%5D/source/SecurityPosture_ViewRecommendation)<br/>
[![allowedLocationPolicy](https://img.shields.io/endpoint?url=https%3A%2F%2Ffunc-cydig-comp-state-prod.azurewebsites.net%2Fapi%2FReadToReadme%3Fcode%3DxaEvCDsaK01y2Z6SBivwOKndN4o915lpOTt1VkmULgsxgsjkml7u1DOhgULzmAPX%26teamName%3DCyDig%26teamProjectName%3DCyDig%26codeRepositoryName%3Dcydig-compliance-action%26stateType%3DallowedLocationPolicy)](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyMenuBlade/~/Compliance)<br/>
![pentestDate](https://img.shields.io/endpoint?url=https%3A%2F%2Ffunc-cydig-comp-state-prod.azurewebsites.net%2Fapi%2FReadToReadme%3Fcode%3DxaEvCDsaK01y2Z6SBivwOKndN4o915lpOTt1VkmULgsxgsjkml7u1DOhgULzmAPX%26teamName%3DCyDig%26teamProjectName%3DCyDig%26codeRepositoryName%3Dcydig-compliance-action%26stateType%3DpentestDate)<br/>
![numberOfDeployedVMs](https://img.shields.io/endpoint?url=https%3A%2F%2Ffunc-cydig-comp-state-prod.azurewebsites.net%2Fapi%2FReadToReadme%3Fcode%3DxaEvCDsaK01y2Z6SBivwOKndN4o915lpOTt1VkmULgsxgsjkml7u1DOhgULzmAPX%26teamName%3DCyDig%26teamProjectName%3DCyDig%26codeRepositoryName%3Dcydig-compliance-action%26stateType%3DnumberOfDeployedVMs)<br/>
![usersInProduction](https://img.shields.io/endpoint?url=https%3A%2F%2Ffunc-cydig-comp-state-prod.azurewebsites.net%2Fapi%2FReadToReadme%3Fcode%3DxaEvCDsaK01y2Z6SBivwOKndN4o915lpOTt1VkmULgsxgsjkml7u1DOhgULzmAPX%26teamName%3DCyDig%26teamProjectName%3DCyDig%26codeRepositoryName%3Dcydig-compliance-action%26stateType%3DusersInProduction)<br/>



# CyDig Compliance Action

This repository contains a action with compliance controls.

## Compliance Controls

The compliance controls that are currently available are listed below.

* Number of reviewers on a pull request
* Date of latest threat modeling
* Date of latest penetration test

## Development on already existing or new control.

1. To start development, create a branch named **feature/your-branch-name**.

2. Run the command below from the root.

```bash
npm install
```

To enable linting and format rules if´ts not enabled. So, every time you make a commit, a pre-hook will run to validate the rules. If there are any violation you will se an error or a warning in the terminal. Read more [here](/LinitingAndFormat.md). To fix format warnings run the following command from the **root**:

```bash
npm run format:write
```

3. If you are developing a new control, create a new folder for your control in the ```src``` folder.
4. Start developing. To compile your code, run the following command:  

```bash
npm run build
```

5. To run the tests, run the following command:   

```bash 
npm run test
```

To generated test results in a XML-file, run the following command:  

```bash 
npm run testScript 
```


6. If necessary, add input parameter in ```action.yml```, if it is needed for the control.

7. When pushing the code the repository the workflow will build and push your code to the repository.

*For more information about developing in the CyDig project, please go to the [Wiki](https://dev.azure.com/CyDig/CyDig/_wiki/wikis/CyDig.wiki/5/Att-jobba-i-CyDig)*

## Creating a release for the action
At cydig, we follow [Semantic Versioning](https://semver.org/) for our action releases. Practically, this means that when you're developing and creating a pull request (PR), you can assign one of three labels to the PR: Major, Minor, or Patch. These labels correspond to version numbers in the format vX.Y.Z, where X is the major version, Y is the minor version, and Z is the patch version.For example, if you add the "Patch" label to your PR, and it's approved and merged, a workflow will automatically run to create a release for the action. Here's an illustration of how the version number would change before and after the PR:
* Version before PR: v1.0.1
* Version after PR: v1.0.2