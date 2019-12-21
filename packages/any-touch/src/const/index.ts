export const SUPPORT_TOUCH = 'ontouchstart' in window;


// input的类型
export const INPUT_START = 'start';
export const INPUT_MOVE = 'move';
export const INPUT_CANCEL = 'cancel';
export const INPUT_END = 'end';

export const TOUCH = 'touch';
export const MOUSE = 'mouse';

export const TOUCH_START = 'touchstart';
export const TOUCH_MOVE = 'touchmove';
export const TOUCH_END = 'touchend';
export const TOUCH_CANCEL = 'touchcancel';

export const MOUSE_UP = 'mouseup';
export const MOUSE_MOVE = 'mousemove';
export const MOUSE_DOWN = 'mousedown';





export const AUTO = 'auto';
export const NONE = 'none';
export const MANIPULATION = 'manipulation'
// 方向
export const DIRECTION_LEFT = 'left';
export const DIRECTION_RIGHT = 'right';
export const DIRECTION_UP = 'up';
export const DIRECTION_DOWN = 'down';
export const DIRECTION_X = [DIRECTION_LEFT, DIRECTION_RIGHT];
export const DIRECTION_Y = [DIRECTION_UP, DIRECTION_DOWN];
export const DIRECTION_ALL = [DIRECTION_LEFT, DIRECTION_RIGHT,DIRECTION_UP, DIRECTION_DOWN];


export const PAN_X = 'pan-x';
export const PAN_Y = 'pan-y';
export const COMPUTE = 'compute';

// 计算触发时间间隔, 防止事件触发就一直计算
export const COMPUTE_INTERVAL = 16;


// 计算时候取touchs.clientX | clientY
export const CLIENT_X = 'clientX';
export const CLIENT_Y = 'clientY';


// 识别器状态码
export const RECOGNIZER_STATUS_POSSIBLE = 1;
export const RECOGNIZER_STATUS_BEGAN = 2;
export const RECOGNIZER_STATUS_CHANGED = 4;
export const RECOGNIZER_STATUS_ENDED = 8;
export const RECOGNIZER_STATUS_RECOGNIZED = RECOGNIZER_STATUS_ENDED;
export const RECOGNIZER_STATUS_CANCELLED = 16;
export const RECOGNIZER_STATUS_FAILED = 32;



export const WRONG_DIRECTION = 'wrong direction!';