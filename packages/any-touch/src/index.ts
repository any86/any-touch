/*
* ==================== 支持的手势 ====================
* rotate 旋转
* pinch 捏合,
* tap 点击
* press 按压
* pan 拖拽
* swipe 快划
*/
import {createAnyTouch} from '@any-touch/core';
import Tap from '@any-touch/tap';
import Pan from '@any-touch/pan';
import Swipe from '@any-touch/swipe';
import Press from '@any-touch/press';
import Pinch from '@any-touch/pinch';
import Rotate from '@any-touch/rotate';
export const Core = createAnyTouch()
export { Tap, Pan, Swipe, Press, Pinch, Rotate }
export { STATUS_POSSIBLE, STATUS_START, STATUS_MOVE, STATUS_END, STATUS_CANCELLED, STATUS_FAILED, STATUS_RECOGNIZED } from '@any-touch/shared';
import AnyTouch from './UMD';
export default AnyTouch;