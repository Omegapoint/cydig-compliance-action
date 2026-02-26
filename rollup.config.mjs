import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { builtinModules } from 'module';

export default {
    input: 'dist/src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'cjs',
        interop: 'compat',
    },
    external: [...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
    plugins: [
        resolve({ preferBuiltins: true, exportConditions: ['import', 'default', 'require'] }),
        commonjs(),
        json(),
    ],
};
