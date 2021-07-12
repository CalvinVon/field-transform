import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import ts from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import packageJson from './package.json';

const getPath = _path => path.resolve(__dirname, _path);

export default {
    input: './src/index.ts',
    output: [
        {
            dir: './lib',
            format: 'cjs',
            exports: 'named',
        },
        // {
        //     file: packageJson.unpkg,
        //     format: 'iife',
        //     name: packageJson.name,
        //     exports: 'named',
        //     plugins: [
        //         ts({
        //             tsconfig: getPath('./tsconfig.json'),
        //             // outDir: './dist',
        //             // baseUrl: './src'
        //         }),
        //         terser()
        //     ],
        // }
    ],
    plugins: [
        ts({
            tsconfig: getPath('./tsconfig.json'),
            outDir: './lib'
        }),
        resolve({
            extensions: ['.ts']
        }),
    ]
}