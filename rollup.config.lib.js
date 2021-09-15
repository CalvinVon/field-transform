import resolve from '@rollup/plugin-node-resolve';
import ts from '@rollup/plugin-typescript';
import packageJson from './package.json';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
    input: './src/index.ts',
    output: {
        file: packageJson.main,
        format: 'cjs',
        name: 'fieldTransform',
        exports: 'named',
    },
    plugins: [
        ts({
            tsconfig: './tsconfig.json',
            outDir: '',
            noEmit: true,
            declaration: true,
            declarationMap: false,
            composite: false
        }),
        resolve({
            extensions: ['.ts']
        }),
    ]
}

export default config;
