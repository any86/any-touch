import { PluginContext, PluginOptions } from "./types";
import { STATE } from "./const";
export function createPluginContext<D extends Required<PluginOptions>>(defaultOptions: D, options?: PluginOptions): PluginContext<D> {
    return { ...defaultOptions, ...options, state: STATE.POSSIBLE, disabled: false };
}