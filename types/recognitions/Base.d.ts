import { AnyTouchEvent, directionString } from '../interface';
export default abstract class Recognizer {
    name: string;
    disabled: boolean;
    status: string;
    isRecognized: boolean;
    options: {
        [propName: string]: any;
    };
    requireFailureRecognizers: any[];
    $root: any;
    eventEmitter: any;
    isWaitingOther: boolean;
    constructor(options: {
        name?: string;
        [k: string]: any;
    });
    set(options?: {}): this;
    $injectRoot($root: any): this;
    emit(type: string, payload: any): void;
    requireFailure(recognizer: this): void;
    removeRequireFailure(recognizer: Recognizer): void;
    hasRequireFailure(): boolean;
    isAllRequireFailureRecognizersDisabled(): boolean;
    isAllRequiresFailedOrPossible(): boolean;
    isValidPointLength(pointLength: number): boolean;
    isOnlyHorizontal(): boolean;
    isOnlyVertical(): boolean;
    isVaildDirection(direction?: directionString): boolean;
    flow(isVaild: boolean, activeStatus: string, touchDevice: string): string;
    protected _resetStatus(): void;
    recognize(computed: AnyTouchEvent): void;
    abstract test(computed: AnyTouchEvent): boolean;
    afterRecognized(computed: AnyTouchEvent): void;
    afterEmit(computed: AnyTouchEvent): void;
    abstract getTouchAction(): string[];
}
