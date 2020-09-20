/**
 * 是否微信
 */
export const IS_WX = !!(window as any)!.wx;

export const CLIENT_X = 'clientX';
export const CLIENT_Y = 'clientY';
/**
 * 计算方向/速度的时间间隔
 */
export const COMPUTE_INTERVAL = 16;

/**
 * 输入阶段
 */
export const INPUT_START = 'start';
export const INPUT_MOVE = 'move';
export const INPUT_CANCEL = 'cancel';
export const INPUT_END = 'end';

/**
 * 方向
 */
export const DIRECTION_LEFT = 'left';
export const DIRECTION_RIGHT = 'right';
export const DIRECTION_UP = 'up';
export const DIRECTION_DOWN = 'down';
export const NONE = 'none';
export const enum DIRECTION {
    LEFT = 'left',
    RIGHT = 'right',
    UP = 'up',
    DOWN = 'down',
}


export const TOUCH = 'touch';
export const MOUSE = 'mouse';

export const TOUCH_START = TOUCH + INPUT_START as 'touchstart';
export const TOUCH_MOVE = TOUCH + INPUT_MOVE as 'touchmove';
export const TOUCH_END = TOUCH + INPUT_END as 'touchend';
export const TOUCH_CANCEL = TOUCH + INPUT_CANCEL as 'touchcancel';

export const MOUSE_UP = MOUSE + DIRECTION_UP as 'mouseup';
export const MOUSE_MOVE = MOUSE + INPUT_MOVE as 'mousemove';
export const MOUSE_DOWN = MOUSE + DIRECTION_DOWN as 'mousedown';



/**
 * 识别器状态码
 */
export const enum RECOGNIZER_STATUS {
    POSSIBLE,
    START,
    MOVE,
    END,
    RECOGNIZED,
    FAILED,
    CANCELLED
}