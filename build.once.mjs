import { buildContext } from './build.mjs'

const context = await buildContext()
await context.rebuild()
console.log("Build complete!")
await context.dispose()
