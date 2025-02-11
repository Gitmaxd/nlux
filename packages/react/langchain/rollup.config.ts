import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import strip from '@rollup/plugin-strip';
import terser from '@rollup/plugin-terser';
import {RollupOptions} from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import {generateDts} from '../../../pipeline/utils/rollup/generateDts';
import {generateOutputConfig} from '../../../pipeline/utils/rollup/generateOutputConfig';
import {replaceImportedModules} from '../../../pipeline/utils/rollup/replaceImportedModules';

const isProduction = process.env.NODE_ENV === 'production';
const packageName = '@nlux/langchain-react';
const outputFile = 'langchain-react';

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
            !isProduction && replaceImportedModules(),
            replace({
                values: {
                    'process.env.NLUX_DEBUG_ENABLED': JSON.stringify(isProduction ? 'false' : 'true'),
                },
                preventAssignment: true,
            }),
            isProduction && terser(),
        ],
        external: [
            '@nlux/react',
            'react',
        ],
        output: generateOutputConfig(packageName, outputFile, isProduction),
    },
    generateDts(outputFile, isProduction),
]);

export default packageConfig;
