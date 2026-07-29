import { SIRENDARK } from "@/config"
import Logger from "@/Logger"
import loadTemplates from "@/loadTemplates"
import { onRenderPlayerSheet } from "@/PlayerSheetSiren"
import { extendPlayerSD } from "./PlayerSiren"
import { extendActorSD } from "./ActorSDExtended"

globalThis.sirendark = {
    config: SIRENDARK,
    debug: Logger.debug,
    error: Logger.error,
    log: Logger.log,
    warn: Logger.warn,
}

Hooks.on('init', () => {
    sirendark.log("Initializing Sirendark module for Shadowdark!")

    loadTemplates()
    
    CONFIG.Actor.documentClass = extendActorSD(CONFIG.Actor.documentClass as any)
    CONFIG.Actor.dataModels['Player'] = extendPlayerSD(CONFIG.Actor.dataModels['Player'] as any) 

    Hooks.on(`render${sheetName}`, onRenderPlayerSheet as any)
})

const sheetName = 'PlayerSheetSD'
