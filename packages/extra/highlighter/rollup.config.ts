import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import strip from '@rollup/plugin-strip';
import terser from '@rollup/plugin-terser';
// @ts-ignore
import csso from 'postcss-csso';
import postcssImport from 'postcss-import';
import {LogLevel, RollupOptions} from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import {generateDts} from '../../../pipeline/utils/rollup/generateDts';
import {generateOutputConfig} from '../../../pipeline/utils/rollup/generateOutputConfig';
import {replaceImportedModules} from '../../../pipeline/utils/rollup/replaceImportedModules';

const isProduction = process.env.NODE_ENV === 'production';
const packageName = '@nlux/highlighter';
const outputFile = 'highlighter';
const folder = isProduction ? 'prod' : 'dev';

const cssEntry = (input: string, output: string) => ({
    input,
    logLevel: 'warn' as LogLevel,
    plugins: [
        postcss({
            extract: true,
            sourceMap: !isProduction,
            plugins: [
                postcssImport({
                    plugins: [csso({comments: false, restructure: false})],
                }),
            ],
        }),
    ],
    output: [
        {
            file: output,
            sourcemap: !isProduction,
            strict: true,
        },
    ],
});

const packageConfig: () => Promise<RollupOptions[]> = async () => ([
    {
        input: './src/index.ts',
        logLevel: 'silent',
        treeshake: 'smallest',
        strictDeprecations: true,
        plugins: [
            commonjs(),
            esbuild(),
            isProduction && strip({
                include: '**/*.(mjs|js|ts)',
                functions: ['debug', 'console.log', 'console.info'],
            }),
            !isProduction && nodeResolve(),
            !isProduction && replaceImportedModules(),
            replace({
                preventAssignment: false,
            }),
            replace({
                values: {
                    'process.env.NLUX_DEBUG_ENABLED': JSON.stringify(isProduction ? 'false' : 'true'),
                },
                preventAssignment: true,
            }),
            terser(),
        ],
        external: [
            '@nlux/core',
        ],
        output: generateOutputConfig(packageName, outputFile, isProduction),
    },
    generateDts(outputFile, isProduction),
    cssEntry('./src/themes/stackoverflow/dark.css', `../../../dist/${folder}/${outputFile}/dark-theme.css`),
    cssEntry('./src/themes/stackoverflow/light.css', `../../../dist/${folder}/${outputFile}/light-theme.css`),
]);

export default packageConfig;
