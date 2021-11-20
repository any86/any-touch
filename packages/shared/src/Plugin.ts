import { RECOGNIZER_STATE } from "./types";
import { STATE } from "./const";
export function createPluginContext<T extends string>(name: T): { state: RECOGNIZER_STATE, disabled: boolean, name: T } {
    return { state: STATE.POSSIBLE, disabled: false, name };
}
