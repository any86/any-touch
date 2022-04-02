export const TOUCH_START = 'touchstart';
export const TOUCH_MOVE = 'touchmove';
export const TOUCH_END = 'touchend';
export const TOUCH_CANCEL = 'touchcancel';

export const MOUSE_UP = 'mouseup';
export const MOUSE_MOVE = 'mousemove';
export const MOUSE_DOWN = 'mousedown';


export const CLIENT_X = 'clientX';
export const CLIENT_Y = 'clientY';


/**
 * 输入阶段
 */
 export const TYPE_START = 'start';
 export const TYPE_MOVE = 'move';
 export const TYPE_CANCEL = 'cancel';
 export const TYPE_END = 'end';

// const ObjectToString = Object.prototype.toString;
export function isFunction(input: any): input is Function {
    return '[object Function]' === Object.prototype.toString.call(input);
}