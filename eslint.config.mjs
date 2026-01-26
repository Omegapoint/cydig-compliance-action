// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
    eslint.configs.recommended,
    tseslint.configs.recommended,
    { ignores: ['node_modules', 'tests', 'dist', 'func'] },
    {
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
    },
]);
