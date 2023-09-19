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

By first running this command in the root you get the linting and format rules downloaded. So, every time you make a commit, a pre-hook will run to validate the rules. If there are any violation you will se an error or a warning in the terminal. Read more [here](/LinitingAndFormat.md). To fix format warnings run the following command from the **root**:

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

If you don't have at least 1 test in the ```test``` folder, the workflow won't work. 
6. If necessary, add input parameter in ```action.yml```, if it is needed for the control.
7. When pushing the code the repository the workflow will build and push your code to the repository.
