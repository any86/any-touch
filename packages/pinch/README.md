# @any-touch/pinch
**缩放**识别器.

## 快速开始
```javascript
// 只加载pinch识别器(拖拽)
import Core from '@any-touch/core';
import Pinch from '@any-touch/pinch';
Core.use(Pinch, 参数)
const at = new Core(el);
// 拖拽
at.on('pinch', (ev) => {
    // ev包含位置/速度/方向等信息
});
```
**⚠️注意**: 执行`npm i any-touch`后, **@any-touch/core和@any-touch/pinch**便已自动安装, 直接引入即可.

## 参数
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'pinch'|自定义事件名称|
|pointLength|`Number`|2|支持的触点数, 可支持多指拖拽|
|threshold| `Number`|0|缩放超过0倍才触发pinch事件|