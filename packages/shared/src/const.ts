// 计算时候取touchs.clientX | clientY
export const CLIENT_X = 'clientX';
export const CLIENT_Y = 'clientY';

export const COMPUTE_INTERVAL = 16;

// input的类型
export const INPUT_START = 'start';
export const INPUT_MOVE = 'move';
export const INPUT_CANCEL = 'cancel';
export const INPUT_END = 'end';

// 方向
export const DIRECTION_LEFT = 'left';
export const DIRECTION_RIGHT = 'right';
export const DIRECTION_UP = 'up';
export const DIRECTION_DOWN = 'down';
export const NONE = 'none';

export const TOUCH = 'touch';
export const MOUSE = 'mouse';

export const TOUCH_START = TOUCH + INPUT_START as 'touchstart';
export const TOUCH_MOVE = TOUCH + INPUT_MOVE as 'touchmove';
export const TOUCH_END = TOUCH + INPUT_END as 'touchend';
export const TOUCH_CANCEL = TOUCH + INPUT_CANCEL as 'touchcancel';

export const MOUSE_UP = MOUSE + DIRECTION_UP as 'mouseup';
export const MOUSE_MOVE = MOUSE + INPUT_MOVE as 'mousemove';
export const MOUSE_DOWN = MOUSE + DIRECTION_DOWN as 'mousedown';

export const SUPPORT_TOUCH = `on${TOUCH_START}` in window;


// 识别器状态码
// 为了简化Array.include的类型判断, 统一字符串类型
// 稍后都改为数字, 给STATUS_START增加字符串映射
export const STATUS_POSSIBLE = 'p';
export const STATUS_START = INPUT_START;
export const STATUS_MOVE = INPUT_MOVE;
export const STATUS_END = INPUT_END;
export const STATUS_RECOGNIZED = 'r';
export const STATUS_FAILED = 'f';
export const STATUS_CANCELLED = INPUT_CANCEL;