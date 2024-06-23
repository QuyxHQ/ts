import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import terser from '@rollup/plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import babel from '@rollup/plugin-babel'
import nodePolyfills from 'rollup-plugin-node-polyfills'

const packageJson = require('./package.json')

export default [
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
            peerDepsExternal(),
            resolve({
                preferBuiltins: true,
                browser: true,
            }),
            commonjs(),
            babel({
                babelHelpers: 'bundled',
                exclude: 'node_modules/**',
                presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            }),
            nodePolyfills(),
            terser(),
        ],
    },
    {
        input: 'dist/cjs/types/lib/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: 'esm' }],
        plugins: [dts.default()],
        external: [/\.css$/],
    },
]
