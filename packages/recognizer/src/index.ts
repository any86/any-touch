import type { RecognizerOptions, RecognizerContext, RecognizerStatus } from '@any-touch/shared';
import { STATUS_POSSIBLE } from '@any-touch/shared';


// 导出recognizeForPressMoveLike,
// resetStatusForPressMoveLike
export { default as recognizeForPressMoveLike } from './recognizeForPressMoveLike';
export { default as canResetStatusForPressMoveLike } from './resetStatusForPressMoveLike';

// 联合变交叉
// type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export default function <D, O>(defaultOptions: D, options?: O): D & O & { status: RecognizerStatus, set: (key: string, value: string | number) => void } {
    let _context = Object.assign(
        {},
        defaultOptions,
        options,
        {
            status: STATUS_POSSIBLE as RecognizerStatus,
            set: (key: string, value: string | number) => {
                (_context as any)[key] = value;
            }
        });
    return _context;
}
