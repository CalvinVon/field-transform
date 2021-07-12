import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import ts from '@rollup/plugin-typescript';

const getPath = _path => path.resolve(__dirname, _path);

export default {
    input: getPath('./src/index.ts'),
    output: {
        dir: getPath('./lib'),
        format: 'cjs',
        exports: 'named',
    },
    plugins: [
        ts({
            tsconfig: './tsconfig.json',
            outDir: './lib'
        }),
        resolve({
            extensions: ['.ts']
        }),
    ]
}