// 识别器状态码
// 注意: 此处的值会直接被事件名所用, 如panstart/panmove等等
export const STATUS_POSSIBLE = 'possible';
export const STATUS_START = 'start';
export const STATUS_MOVE = 'move';
export const STATUS_END = 'end';
export const STATUS_CANCELLED = 'cancel';
export const STATUS_FAILED = 'failed';
export const STATUS_RECOGNIZED = 'recognized';