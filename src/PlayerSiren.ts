import { DataField } from "@7h3laughingman/foundry-types/client/data/fields.mjs"
import { type ActorSchema } from "@7h3laughingman/foundry-types/common/documents/actor.mjs"
import { SIRENDARK } from "@/config"
import { ChatMessageSD, PlayerSD, SDDiceConfig } from "@/types/shadowdark"
import { AdvantageState } from "./common"

export type PlayerModelSiren = PlayerSDModel & {
    saves: DataField
}

class SaveBonusModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            value: new fields.NumberField({integer: true, initial: 0})
        }
    }
}

const fields = foundry.data.fields

export type PlayerSDExtension = {
    _generateSavingThrowConfig(config: SDDiceConfig): Promise<void>;
    rollSavingThrow(saveId: string, config: SDDiceConfig ):  Promise<boolean | ChatMessageSD>
}

export function extendPlayerSD(original: typeof PlayerSD) {
    
    return class extended extends original implements PlayerSD {
        constructor(...args: any) {
            super(...args)
            this.rollConfigGenerators['saving-throw'] = this._generateSavingThrowConfig.bind(this)
        }

        static defineSchema(): ActorSchema {
            const schema = {} as PlayerModelSiren

            schema.saves = new fields.SchemaField(
                SIRENDARK.SAVE_KEYS.reduce((obj, key) => {
                    obj[key] = new fields.EmbeddedDataField(SaveBonusModel)
                    return obj;
                }, {} as Record<string, DataField>)    
            )

            return Object.assign(super.defineSchema(), schema)
        }

        async _generateSavingThrowConfig(config: SDDiceConfig) {
            if(!config.save)
                return false;

            if(!SIRENDARK.SAVE_KEYS.includes(config.save)) 
                return false

            config.title = game.i18n.localize('SIRENDARK.dialog.saving_throw.title')
            config.heading = game.i18n.localize(`SIRENDARK.dialog.saving_throw.${config.save}`)

            shadowdark.dice.initializeD20Check(config)
            config.mainRoll!.label = game.i18n.localize("SIRENDARK.roll.check")

            // Formula
            const saveRecord = this.saves[config.save]
            const saveBase = saveRecord ? saveRecord.value : 0
            // TODO: Inject a case for `roll.save.bonus.all`
            const rollKey = this._getActiveEffectKeys(`roll.save.bonus.${config.save}`, saveBase, undefined, config)
            config.mainRoll!.bonus = shadowdark.dice.formatBonus(rollKey.value)
            config.mainRoll!.formula = `${config.mainRoll!.base}${config.mainRoll!.bonus}`
            
            // Check for advantage
            // TODO: Inject a case for `roll.save.advantage.all`
            const advRollKey = this._getActiveEffectKeys(`roll.save.advantage.${config.save}`, AdvantageState.normal, undefined, config)
            config.mainRoll!.advantage = advRollKey.value
            
            // Tooltips
            const tooltips = []
            tooltips.push(rollKey.tooltips)
            tooltips.push(advRollKey.tooltips)
            config.mainRoll!.tooltips = tooltips.filter(Boolean).join(", ");
        }

        async rollSavingThrow(saveId: string, config: SDDiceConfig = {} ): Promise<boolean | ChatMessageSD> {

                
            config.type = "saving-throw"
            config.actorUuid = this.parent.uuid
            
            const save = saveId.toLowerCase()
            if(!SIRENDARK.SAVE_KEYS.includes(save)) 
                return false
            
            config.save = save

            config.title = game.i18n.localize('SIRENDARK.dialog.saving_throw.title')
            config.heading = game.i18n.localize(`SIRENDARK.dialog.saving_throw.${config.save}`)

            shadowdark.dice.initializeD20Check(config)
            
            const config_ok = this.rollConfigGenerators['saving-throw'](config)
            if(!config_ok) {
                return false
            }

            // Show prompt
            const confirm = await shadowdark.dice.rollDialog(config)
            if(!confirm)
                return false

            // Call hooks
            const isCanceled = !Hooks.call("Sirendark-Saving-Throw", config)
            if(isCanceled)
                return false

            return await shadowdark.dice.rollFromConfig(config)
        }
    }
}
