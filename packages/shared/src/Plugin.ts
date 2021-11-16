import { RECOGNIZER_STATE } from "./index";
import { STATE_POSSIBLE } from "./index";
export function createPluginContext<T extends string>(name: T): { state: RECOGNIZER_STATE, disabled: boolean, name: T } {
    return { state: STATE_POSSIBLE, disabled: false, name };
}
