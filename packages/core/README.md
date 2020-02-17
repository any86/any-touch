# @any-touch/core
🤖核心组件, 主要用来把Mouse/Touch输入变成统一的输出, 实现PC/Mobile端的兼容, 提供了"**at:**"开头的兼容事件.

```javascript
import Core from '@any-touch/core';
const at = new Core(el);
// 兼容Mouse/Touch
at.on('at:touch', (ev) => {
    // ev包含位置/时间/事件对象等属性.
});
// start / move / end / cancel
at.on('at:touchstart', onStart);
at.on('at:touchmove', onMove);
at.on('at:touchend', onEnd);
at.on('at:touchcancel', onCancel);
```