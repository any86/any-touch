import { SupportEvent } from '@any-touch/shared';
import { isRegExp, isFunction } from '@any-touch/shared';
import { Options } from './index';

/**
 * 根据preventDefaultExclude
 * 检查是否需要阻止默认事件
 * @param event touch/mouse事件对象
 * @param options anytouch的选项
 * @returns 是否阻止默认事件
 */
export default function (event: SupportEvent, options: Options): boolean {
    const { preventDefault, preventDefaultExclude } = options;
    let isPreventDefault = preventDefault || void 0 !== preventDefaultExclude;
    if (null !== event.target) {
        if (isRegExp(preventDefaultExclude)) {
            if ('tagName' in event.target) {
                const { tagName } = event.target;
                isPreventDefault = !preventDefaultExclude.test(tagName);
            }
        } else if (isFunction(preventDefaultExclude)) {
            isPreventDefault = !preventDefaultExclude(event);
        }
    }
    return isPreventDefault;
}