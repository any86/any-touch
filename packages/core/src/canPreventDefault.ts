import { SupportEvent } from '@any-touch/shared';
import { isRegExp, isFunction } from '@any-touch/shared';
import { Options } from './index';
/**
* 检查是否需要阻止默认事件, 根据preventDefaultExclude
* @param {SupportEvent} 原生event
*/
export default function (event: SupportEvent, options: Options): boolean {
    if (!options.isPreventDefault) return false;
    let isPreventDefault = false;
    if (null !== event.target) {
        const { preventDefaultExclude } = options;
        if (isRegExp(preventDefaultExclude)) {
            const { tagName } = <HTMLElement>event.target;
            if (void 0 !== tagName) {
                isPreventDefault = !preventDefaultExclude.test(tagName);
            }
        } else if (isFunction(preventDefaultExclude)) {
            isPreventDefault = !preventDefaultExclude(event);
        }
    }
    return isPreventDefault;
}