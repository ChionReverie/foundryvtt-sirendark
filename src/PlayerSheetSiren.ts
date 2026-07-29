import { type ApplicationRenderContext } from "@7h3laughingman/foundry-types/client/applications/_types.mjs"
import type ActorSheet from "@7h3laughingman/foundry-types/client/appv1/sheets/actor-sheet.mjs"
import { ActorSD, PlayerSD, SaveFields } from "./types/shadowdark"
import { PlayerSDExtension } from "./PlayerSiren"

type PlayerSheetSD = ActorSheet<ActorSD> & {
    // Custom data we're inserting
    editingSaves?: boolean
}
type PlayerContext = ApplicationRenderContext & {
    // Custom data we're inserting
    editingSaves: boolean
    saves: { 
        fort: SaveFields,
        reflex: SaveFields,
        will: SaveFields,
    },
}

export async function onRenderPlayerSheet(...args: [PlayerSheetSD, JQuery, PlayerContext]): Promise<boolean | void> {
    await injectRenderSavingThrows(...args)
}

async function injectRenderSavingThrows(app: PlayerSheetSD, html: JQuery, context: PlayerContext) {

    const targetContainer = html.find('.abilities-grid>:first-child').first()
    if(targetContainer.length == 0) {
        throw "Uh oh! We can't find the abilities grid =("
    }

    const system = app.actor.system as PlayerSD & PlayerSDExtension;
    context.editingSaves = app.editingSaves ? true : false
    context.saves = system.saves

    const text = await foundry.applications.handlebars.renderTemplate("modules/sirendark/templates/saves.hbs", context)
    targetContainer.append(text)

    html.find("[data-action='toggle-edit-saves']").on('click', (event) => {
        event.preventDefault()
        app.editingSaves = !app.editingSaves
        app.render()
    })
    html.find("[data-action='roll-save-check']").on('click', (event) => {
        event.preventDefault()
        const save = event.currentTarget.dataset['save']
        if(!save)
            return
        const skipPrompt = event.shiftKey ? true : false
        system.rollSavingThrow(save, {skipPrompt} )
    })
}
