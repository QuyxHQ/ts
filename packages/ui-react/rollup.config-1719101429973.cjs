'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var resolve = require('@rollup/plugin-node-resolve');
var commonjs = require('@rollup/plugin-commonjs');
var typescript = require('@rollup/plugin-typescript');
var dts = require('rollup-plugin-dts');
var terser = require('@rollup/plugin-terser');
var peerDepsExternal = require('rollup-plugin-peer-deps-external');
var postcss = require('rollup-plugin-postcss');
var json = require('@rollup/plugin-json');

const packageJson = require('./package.json');

var rollup_config = [
    {
        input: 'lib/index.ts',
        output: [
            {
                file: packageJson.main,
                format: 'esm',
                sourcemap: true,
                inlineDynamicImports: true,
            },
        ],
        plugins: [
            postcss({
                config: {
                    path: './postcss.config.cjs',
                },
                extensions: ['.css'],
                minimize: true,
                inject: { insertAt: 'top' },
            }),
            typescript(),
            json(),
            peerDepsExternal(),
            resolve(),
            commonjs(),
            terser(),
        ],
    },
    {
        input: 'dist/cjs/types/src/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: 'esm' }],
        plugins: [dts.default()],
        external: [/\.css$/],
    },
];

exports.default = rollup_config;
