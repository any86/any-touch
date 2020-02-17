# @any-touch/share
一些公用方法和常量.

```javascript
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

// 计算时候取touchs.clientX | clientY
export const CLIENT_X = 'clientX';
export const CLIENT_Y = 'clientY';

export const COMPUTE_INTERVAL = 16;

// 识别器状态码
// 注意: 此处的值会直接被事件名所用, 如panstart/panmove等等
export const STATUS_POSSIBLE = 'possible';
export const STATUS_START = 'start';
export const STATUS_MOVE = 'move';
export const STATUS_END = 'end';
export const STATUS_CANCELLED = 'cancel';
export const STATUS_FAILED = 'failed';
export const STATUS_RECOGNIZED = 'recognized';


// 方向
export const DIRECTION_LEFT = 'left';
export const DIRECTION_RIGHT = 'right';
export const DIRECTION_UP = 'up';
export const DIRECTION_DOWN = 'down';
export const NONE = 'none';

```