/*
* ==================== 支持的手势 ====================
* rotate 旋转
* pinch 捏合,
* tap 点击
* press 按压
* pan 拖拽
* swipe 快划
*/


import AnyTouch from '@any-touch/core';
import Tap from '@any-touch/tap';
import Pan from '@any-touch/pan';
import Swipe from '@any-touch/swipe';
import Press from '@any-touch/press';
import Pinch from '@any-touch/pinch';
import Rotate from '@any-touch/rotate';
import {RecognizerFunction, STATUS_POSSIBLE, STATUS_START, STATUS_MOVE, STATUS_END, STATUS_CANCELLED, STATUS_FAILED, STATUS_RECOGNIZED } from '@any-touch/shared';


AnyTouch.use(Tap);
AnyTouch.use(Pan);
AnyTouch.use(Swipe);
AnyTouch.use(Press);
AnyTouch.use(Pinch);
AnyTouch.use(Rotate);
AnyTouch.Tap = Tap;
AnyTouch.Pan = Pan;
AnyTouch.Swipe = Swipe;
AnyTouch.Press = Press;
AnyTouch.Pinch = Pinch;
AnyTouch.Rotate = Rotate;
AnyTouch.STATUS_POSSIBLE = STATUS_POSSIBLE;
AnyTouch.STATUS_START = STATUS_START;
AnyTouch.STATUS_MOVE = STATUS_MOVE;
AnyTouch.STATUS_END = STATUS_END;
AnyTouch.STATUS_CANCELLED = STATUS_CANCELLED;
AnyTouch.STATUS_FAILED = STATUS_FAILED;
AnyTouch.STATUS_RECOGNIZED = STATUS_RECOGNIZED;
export default AnyTouch;