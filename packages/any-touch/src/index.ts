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
AnyTouch.use(Tap);
AnyTouch.use(Pan);
AnyTouch.use(Swipe);
AnyTouch.use(Press);
AnyTouch.use(Pinch);
AnyTouch.use(Rotate);
export default AnyTouch;