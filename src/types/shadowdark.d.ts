// This is an incomplete definition of Shadowdark types
import { DataSchema } from "@7h3laughingman/foundry-types/common/abstract/_module.mjs"

import { ActorSchema } from '@7h3laughingman/foundry-types/common/documents/actor.mjs'
import { BaseModule } from '@7h3laughingman/foundry-types/common/packages/_module.mjs';
import BaseSystem from '@7h3laughingman/foundry-types/common/packages/base-system.mjs';
import { AdvantageState } from "@/common";
import { abstract } from "@7h3laughingman/foundry-types/client/_module.mjs";

declare global {
    type PlayerSDModel = DataSchema & {}

    var shadowdark: {
        apps: unknown,
        chat: unknown,
        compendiums: unknown,
        config: unknown,
        defaults: unknown,
        dice: moduleDiceSD,
        effects: unknown,
        documents: unknown,
        macro: unknown,
        sheets: unknown,
        utils: unknown,
        debug: LoggerFn,
        error: LoggerFn,
        log: LoggerFn,
        warn: LoggerFn,
    }
}

declare class PlayerSD extends ActorBaseSD {
    constructor(...args: any)
    readonly modelProvider: BaseSystem | BaseModule | null;
    static defineSchema(): ActorSchema;
}

declare class ActorSD extends foundry.documents.Actor<TokenDocument<Scene | null>> {
    saves: {
        [key: string]: SaveFields,
        fort: SaveFields,
        reflex: SaveFields,
        will: SaveFields,
    }
}


declare type SaveFields = { value: number }


declare class ActorBaseSD extends abstract.TypeDataModel<ActorSD, PlayerSDModel> {
    // Injected stuff!
    saves: {
        [key: string]: SaveFields,
        fort: SaveFields,
        reflex: SaveFields,
        will: SaveFields,
    }
    // Normal Stuff
    rollConfigGenerators: {
        [key: string]: (config: SDDiceConfig) => Promise<boolean | undefined>
    }

    _getActiveEffectKeys(baseKey: string, baseValue: number|string, item?: string, config?: SDDiceConfig): { value: number, tooltips: string[], changes: object[] }
}

declare class RollSD extends foundry.dice.Roll {
    get criticalFailure(): boolean;
    get criticalSuccess(): boolean;
    get success(): boolean;
}

/** Type clarity here is fucked */
type SDDiceConfig = {
    skipPrompt?: boolean,
    title?: string,
    heading?: string,
    /** Appears as the dialog title, and is also used in certain checks  */
    type?: string,
    actorUuid?: string,
    targetUuid?: string,
    situational?: [],
    attack?: unknown,
    save?: string,
    mainRoll?: {
        type: 'main',
        label: string,
        bonus: string,
        formula: string,
        base: string,
        canCritical: boolean,
        success: boolean,
        dc: number,
        advantage: AdvantageState,
        tooltips: string[] | string,
    },
    damageRoll?: {
        type: 'damage',
        label: string,
        base: string,
        bonus: string,
        formula: string,
        needed: boolean,
    }
    messages?: {
        any: [],
        success: [],
        failure: [],
        criticalSuccess: [],
        criticalFailure: [],
    }
}

type RollData = object

declare class ChatMessageSD extends ChatMessage { }

type moduleDiceSD = {
    applyAdvantage(formula: string, adv: AdvantageState): string
    applyCriticalHit(formula: string, multiplier?: number): string
    applyExploding(formula: string): string
    createToolTip(name: string, value: number, prefix: string, key: string): string
    formatBonus(bonus: number | string): string
    initializeD20Check(config?: SDDiceConfig): SDDiceConfig
    resolveFormula(formula: string, rollData?: object, forceDeterministic?: boolean): string
    roll(config: SDDiceConfig, rollData: object): Promise<RollSD>
    rollDamage(config: SDDiceConfig, critical?: boolean): Promise<RollSD>
    rollDamageFromMessage(msg: ChatMessage): Promise<boolean | undefined>
    rerollFromMessage(msg: ChatMessage, rollType: "main" | "damage"): Promise<void>
    rollDialog(config: SDDiceConfig): Promise<boolean>
    rollFromConfig(config: SDDiceConfig): Promise<ChatMessageSD>
    setRollTarget(config?: SDDiceConfig): void
    upradeDie(die: string, modifier?: number): string
}
