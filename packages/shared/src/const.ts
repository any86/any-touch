/**
 * 是否微信
 */
// export const IS_WX = !!(window as any)!.wx;

export const CLIENT_X = 'clientX';
export const CLIENT_Y = 'clientY';
/**
 * 计算方向/速度的时间间隔
 */
export const COMPUTE_INTERVAL = 16;

/**
 * 输入阶段
 */
export const TYPE_START = 'start';
export const TYPE_MOVE = 'move';
export const TYPE_CANCEL = 'cancel';
export const TYPE_END = 'end';

/**
 * 方向
 */
export const DIRECTION_LEFT = 'left';
export const DIRECTION_RIGHT = 'right';
export const DIRECTION_UP = 'up';
export const DIRECTION_DOWN = 'down';

export const TOUCH = 'touch';
export const MOUSE = 'mouse';

export const TOUCH_START = TOUCH + TYPE_START as 'touchstart';
export const TOUCH_MOVE = TOUCH + TYPE_MOVE as 'touchmove';
export const TOUCH_END = TOUCH + TYPE_END as 'touchend';
export const TOUCH_CANCEL = TOUCH + TYPE_CANCEL as 'touchcancel';

export const MOUSE_UP = MOUSE + DIRECTION_UP as 'mouseup';
export const MOUSE_MOVE = MOUSE + TYPE_MOVE as 'mousemove';
export const MOUSE_DOWN = MOUSE + DIRECTION_DOWN as 'mousedown';


// 识别器状态码
export const STATE_POSSIBLE = 0;
export const STATE_RECOGNIZED = 1;
export const STATE_FAILED = 2;
export const STATE_START = 3;
export const STATE_MOVE = 4;
export const STATE_END = 5;
export const STATE_CANCELLED = 6;