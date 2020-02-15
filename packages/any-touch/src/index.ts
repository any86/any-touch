/*
* ==================== 支持的手势 ====================
* rotate 旋转
* pinch 捏合,
* tap 点击
* press 按压
* pan 拖拽
* swipe 快划
*/
import AnyTouch from './UMD';
export {default as Core} from '@any-touch/core';
export {default as Tap}  from '@any-touch/tap';
export {default as Pan}  from '@any-touch/pan';
export {default as Swipe}  from '@any-touch/swipe';
export {default as Press}  from '@any-touch/press';
export {default as Pinch} from '@any-touch/pinch';
export {default as Rotate}  from '@any-touch/rotate';
export {STATUS_POSSIBLE, STATUS_START,STATUS_MOVE,STATUS_END,STATUS_CANCELLED,STATUS_FAILED,STATUS_RECOGNIZED} from '@any-touch/shared';
export default AnyTouch;