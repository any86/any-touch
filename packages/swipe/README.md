# @any-touch/rotate
🤖 **快划**识别器.

## 快速开始
```javascript
// 只加载rotate识别器(拖拽)
import Core from '@any-touch/core';
import Rotate from '@any-touch/rotate';
Core.use(Rotate, 参数)
const at = new Core(el);
// 拖拽
at.on('rotate', (ev) => {
    // ev包含位置/速度/方向等信息
});
```
**⚠️注意**: 执行`npm i any-touch`后, **@any-touch/core和@any-touch/rotate**便已自动安装, 直接引入即可.

## 参数
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'rotate'|自定义事件名称|
|pointLength|`Number`|2|支持的触点数, 可支持多指拖拽|
|threshold| `Number`|0|快划超过0°才触发rotate事件|