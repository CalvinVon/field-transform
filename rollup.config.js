import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import ts from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser';

const getPath = _path => path.resolve(__dirname, _path)

export default {
    input: './src/index.ts',
    output: [
        {
            dir: './lib',
            format: 'cjs',
            exports: 'named',
            plugins: [
                ts({
                    tsconfig: getPath('./tsconfig.json'),
                    outDir: './lib',
                    baseUrl: './src',
                    extensions: ['.ts']
                }),
            ]
        },
        // {
        //     file: './dist/index.min.js',
        //     format: 'iife',
        //     name: 'fieldTransform',
        //     exports: 'named',
        //     plugins: [
        //         ts({
        //             tsconfig: getPath('./tsconfig.json'),
        //             outDir: './dist',
        //             baseUrl: './src'
        //         }),
        //         terser()
        //     ],
        // }
    ],
    plugins: [
        resolve(['.ts'])
    ]
}