import * as esbuild from 'esbuild'
import { glob } from 'glob/raw'
import { cleanPlugin } from 'esbuild-clean-plugin'
import esbuildCopyStaticFiles from 'esbuild-copy-static-files'
import path from 'path'

const loggingPlugin = {
    name: 'logging',
    setup(build) {
        build.onEnd((result) => {
            if(result.errors.length) {
                console.error(`Build Failed with ${result.errors.length}`)
            }
            else {
                console.log("Build finished")
            }
        })
    }
}

const watchDirsPlugin = {
    name: 'watch-dirs',
    setup(build) {
        build.onLoad({filter: /.*/, namespace: 'file'}, async () => {

            const sourceFiles = await glob.glob("src/**/*.ts")
            const staticFiles = await glob.glob("static/**/*")

            const watchFiles = [
                ...sourceFiles,
                ...staticFiles,
            ]
            
            return {
                watchFiles
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
            esbuildCopyStaticFiles({
                src: './static', 
                dest: 'dist',
            }),
            loggingPlugin,
            watchDirsPlugin,
        ],
    }) 
}
