import { ActorSD } from "./types/shadowdark";

export function extendActorSD(original: typeof ActorSD) {
    return class extends original {}
}
