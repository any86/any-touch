// 简单判断是否手机设备
export const MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

// 是否手机设备
export const IS_MOBILE = MOBILE_REGEX.test(navigator.userAgent);

// 是否支持touch事件
export const SUPPORT_TOUCH = ('ontouchstart' in window);

// 是否是移动设备
export const SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

// 方向
export const DIRECTION_NONE = 1; // 0000 0001
export const DIRECTION_LEFT = 2; //  0000 0010
export const DIRECTION_RIGHT = 4; // 0000 0100 
export const DIRECTION_UP = 8; // 0000 1000
export const DIRECTION_DOWN = 16; // 0001 0000

// 位运算 求值 对上上面的4个方向可以简单理解为"+"
export const DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT; // 6
export const DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN; // 24
export const DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL; // 30

// 计算触发时间间隔, 防止事件触发就一直计算
export const COMPUTE_INTERVAL = 25;

// 识别tap允许最大的移动距离
export const MAX_MOVE_OF_TAP = 2;

// 计算时候取touchs.clientX | clientY
export const propX = 'clientX';
export const propY = 'clientY';

// 识别器状态码
export const RECOGNIZER_STATUS_POSSIBLE = 1;
export const RECOGNIZER_STATUS_BEGAN = 2;
export const RECOGNIZER_STATUS_CHANGED = 4;
export const RECOGNIZER_STATUS_ENDED = 8;
export const RECOGNIZER_STATUS_RECOGNIZED = RECOGNIZER_STATUS_ENDED;
export const RECOGNIZER_STATUS_CANCELLED = 16;
export const RECOGNIZER_STATUS_FAILED = 32;
