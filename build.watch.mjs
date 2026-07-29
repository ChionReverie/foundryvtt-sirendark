import * as esbuild from 'esbuild'
import { glob } from 'glob/raw'
import { cleanPlugin } from 'esbuild-clean-plugin'
import esbuildCopyStaticFiles from 'esbuild-copy-static-files'
import { buildContext } from './build.mjs'

const context = await buildContext()
await context.watch()

console.log("Watching for changes!")
