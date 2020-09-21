/**
 * 是否微信
 */
export const IS_WX = !!(window as any)!.wx;
export const NONE = 'none';
export const CLIENT_X = 'clientX';
export const CLIENT_Y = 'clientY';
/**
 * 计算方向/速度的时间间隔
 */
export const COMPUTE_INTERVAL = 16;

/**
 * 输入阶段
 */
export const enum STAGE {
    START = 'start',
    MOVE = 'move',
    END = 'end',
    CANCEL = 'cancel'
}


/**
 * 方向
 */
export const enum DIRECTION {
    LEFT = 'left',
    RIGHT = 'right',
    UP = 'up',
    DOWN = 'down',
}


/**
 * TOUCH事件名称
 */
export const enum TOUCH {
    START = 'touchstart',
    MOVE = 'touchmove',
    END = 'touchend',
    CANCEL = 'touchcancel'
}

/**
 * 鼠标事件名称
 */
export const enum MOUSE {
    UP = 'mouseup',
    MOVE = 'mousemove',
    DOWN = 'mousedown'
}

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