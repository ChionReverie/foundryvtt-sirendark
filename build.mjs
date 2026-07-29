import * as esbuild from 'esbuild'
import { glob } from 'glob/raw'
import { cleanPlugin } from 'esbuild-clean-plugin'
import esbuildCopyStaticFiles from 'esbuild-copy-static-files'
import path from 'path'

const watchDirsPlugin = {
    name: 'watch-dirs',
    setup(build) {
        build.onLoad({filter: /.*/, namespace: 'file'}, () => {
            return {
                watchDirs: [
                    path.resolve(import.meta.dirname, 'static'),
                    path.resolve(import.meta.dirname, 'src'),
                ]
            }
        })
    }
}

export async function buildContext () {
    const entryPoints = await glob('src/**/*.ts')

    return esbuild.context({
        entryPoints: ['./src/sirendark.ts'],
        bundle: true,
        format: 'esm',
        tsconfig: 'tsconfig.json',
        outdir: 'dist',
        outExtension: {'.js': '.mjs'},
        platform: 'browser',
        sourceRoot: 'src',
        metafile: true,
        sourcemap: 'linked',
        plugins: [
            cleanPlugin({}),
            // This isn't working with watch for some reason
            esbuildCopyStaticFiles({
                src: './static', 
                dest: 'dist',
            }),
            watchDirsPlugin,
        ],
    }) 
}
