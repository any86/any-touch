/*
* ==================== 支持的手势 ====================
* rotate 旋转
* pinch 捏合,
* tap 点击
* press 按压
* pan 拖拽
* swipe 快划
*/
import {createCore} from '@any-touch/core';
import Tap from '@any-touch/tap';
import Pan from '@any-touch/pan';
import Swipe from '@any-touch/swipe';
import Press from '@any-touch/press';
import Pinch from '@any-touch/pinch';
import Rotate from '@any-touch/rotate';
import {STATUS_POSSIBLE, STATUS_START,STATUS_MOVE,STATUS_END,STATUS_CANCELLED,STATUS_FAILED,STATUS_RECOGNIZED} from '@any-touch/shared';
const AnyTouch = createCore();
AnyTouch.use(Tap);
AnyTouch.use(Pan);
AnyTouch.use(Swipe);
AnyTouch.use(Press);
AnyTouch.use(Pinch);
AnyTouch.use(Rotate);
(AnyTouch as any).Tap = Tap;
(AnyTouch as any).Pan = Pan;
(AnyTouch as any).Swipe = Swipe;
(AnyTouch as any).Press = Press;
(AnyTouch as any).Pinch = Pinch;
(AnyTouch as any).Rotate = Rotate;
(AnyTouch as any).STATUS_POSSIBLE = STATUS_POSSIBLE;
(AnyTouch as any).STATUS_START = STATUS_START;
(AnyTouch as any).STATUS_MOVE = STATUS_MOVE;
(AnyTouch as any).STATUS_END = STATUS_END;
(AnyTouch as any).STATUS_CANCELLED = STATUS_CANCELLED;
(AnyTouch as any).STATUS_FAILED = STATUS_FAILED;
(AnyTouch as any).STATUS_RECOGNIZED = STATUS_RECOGNIZED;
export default AnyTouch;