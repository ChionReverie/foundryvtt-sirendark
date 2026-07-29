import { ZipArchive } from "archiver";
import { buildContext } from "./build.mjs";
import { createWriteStream } from "fs";

// Build
const context = await buildContext()
await context.rebuild()
console.log("Build complete!")
await context.dispose()

// Package
const output = createWriteStream('sirendark.zip')
const archive = new ZipArchive({})

archive.on('err', (error) => {
    throw error
})
output.on('close', () => {
    console.log('Done!')
    console.log(`Wrote ${archive.pointer()} bytes`)
})

archive.pipe(output)
archive.directory('dist', '/')

await archive.finalize()
