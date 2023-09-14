# How to install linting and format

1. Run the following commands (be in the root, if you don't have a package.json there, run npm init first to create one):

```yaml
npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin husky prettier --save-dev
npm pkg set scripts.prepare="husky install"
npm run prepare
```

2. Copy files: .eslintrc.json, .prettierignore, .prettierrc and .husky/pre-commit

3. Add following to script section in package.json:

```json
"lint": "eslint . --ext .ts",
"lint:fix": "eslint . --fix --ext .ts",
"format:write": "npx prettier -w .",
"format:check": "npx prettier -c .",
```

4. Make a commit. You should see that your files are being checked for rule breaks. If it does not work and you are using a Mac, run following command and try a new commit:

```yaml
chmod ug+x .husky/*
```
