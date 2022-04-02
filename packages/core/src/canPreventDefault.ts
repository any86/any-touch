import type { NativeEvent } from '@any-touch/shared';
import { isFunction } from './const';
import { Options } from './index';
/**
 * 计算是否需要阻止默认事件
 * @param event touch/mouse事件对象
 * @param options anytouch的选项
 * @returns 是否阻止默认事件
 */
export default function (event: NativeEvent, options: Options): boolean {
    const { preventDefault } = options;
    if (isFunction(preventDefault)) {
        return preventDefault(event);
    } else {
        return !!preventDefault;
    }
}