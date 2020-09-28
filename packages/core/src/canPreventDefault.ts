import { SupportEvent } from '@any-touch/shared';
import { isRegExp, isFunction } from '@any-touch/shared';
import { Options } from './index';
/**
* 检查是否需要阻止默认事件, 根据preventDefaultExclude
* @param {SupportEvent} 原生event
*/
export default function (event: SupportEvent, options: Options): boolean {
    // 不阻止默认
    // 那么不进行过滤
    if (!options.preventDefault) return false;
    let preventDefault = true;
    if (null !== event.target) {
        const { preventDefaultExclude } = options;
        if (isRegExp(preventDefaultExclude)) {
            if ('tagName' in event.target) {
                const { tagName } = event.target;
                preventDefault = !preventDefaultExclude.test(tagName);
            }
        } else if (isFunction(preventDefaultExclude)) {
            preventDefault = !preventDefaultExclude(event);
        }
    }
    return preventDefault;
}