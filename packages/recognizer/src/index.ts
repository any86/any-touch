import { RECOGNIZER_STATUS } from '@any-touch/shared';


// 导出recognizeForPressMoveLike,
// resetStatusForPressMoveLike
export { default as recognizeForPressMoveLike } from './recognizeForPressMoveLike';
export { default as canResetStatusForPressMoveLike } from './resetStatusForPressMoveLike';

// 联合变交叉
// type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export default function <D, O>(defaultOptions: D, options?: O): D & O & { status: RECOGNIZER_STATUS, set: (key: string, value: string | number) => void } {
    let _context = Object.assign(
        {},
        defaultOptions,
        options,
        {
            status: RECOGNIZER_STATUS.POSSIBLE,
            set: (key: string, value: string | number) => {
                (_context as any)[key] = value;
            }
        });
    return _context;
}
