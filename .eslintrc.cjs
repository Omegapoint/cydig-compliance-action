/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    ignorePatterns: ['node_modules', 'test', 'dist', 'func'],
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/no-inferrable-types': 0,
        '@typescript-eslint/naming-convention': ['error', { selector: 'variableLike', format: ['camelCase'] }],
        '@typescript-eslint/typedef': [
            'error',
            {
                arrayDestructuring: true,
                memberVariableDeclaration: true,
                parameter: true,
                propertyDeclaration: true,
                variableDeclarationIgnoreFunction: true,
            },
        ],
    },
};
