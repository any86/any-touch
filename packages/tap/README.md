# @any-touch/tap
**点击**识别器.

## 快速开始
```javascript
// 只加载tap识别器(拖拽)
import Core from '@any-touch/core';
import Tap from '@any-touch/tap';
Core.use(Tap, 参数)
const at = new Core(el);
// 拖拽
at.on('tap', (ev) => {
    // ev包含位置/速度/方向等信息
});
```
**⚠️注意**: 执行`npm i any-touch`后, **@any-touch/core和@any-touch/tap**便已自动安装, 直接引入即可.

## 参数
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'tap'|自定义事件名称|
|pointLength|`Number`|2|支持的触点数, 可支持多指拖拽|
|tapTimes| `Number`|1|连续点击指定次数触发|
|waitNextTapTime| `Number`|300|最多等待下一次点击时间,超时识别器状态变为"失败"|
|maxDistance| `Number`|2|从接触到离开允许产生的最大距离|
|tapTmaxDistanceFromPrevTapimes| `Number`|9|2次点击之间允许的最大位移|
|maxPressTime| `Number`|250|从接触到离开屏幕的最大容忍时间|

