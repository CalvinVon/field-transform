import resolve from '@rollup/plugin-node-resolve';
import ts from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import banner from 'rollup-plugin-banner';
import packageJson from './package.json';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
    input: './src/index.ts',
    output: {
        file: packageJson.unpkg,
        format: 'umd',
        name: 'fieldTransform',
        exports: 'named',
    },
    plugins: [
        ts({
            tsconfig: './tsconfig.json',
            outDir: '',
            noEmit: true,
            declaration: false,
            declarationMap: false,
            composite: false
        }),
        resolve({
            extensions: ['.ts']
        }),
        terser(),
        banner('Field Transform\nv<%= pkg.version %>\nby <%= pkg.author %>')
    ]
};

export default config;
