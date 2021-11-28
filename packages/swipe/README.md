# @any-touch/swipe
**快划**识别器.

## 快速开始
```javascript
// 只加载rotate识别器(拖拽)
import Core from '@any-touch/core';
import rotate from '@any-touch/rotate';
Core.use(rotate, 参数)
const at = new Core(el);
// 拖拽
at.on('rotate', (event) => {
    // event包含位置/速度/方向等信息
});
```
**⚠️注意**: 执行`npm i any-touch`后, **@any-touch/core和@any-touch/rotate**便已自动安装, 直接引入即可.

## 参数
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'swipe'|自定义事件名称|
|pointLength|`Number`|1|支持的触点数, 可支持多指触发|
|threshold| `Number`|10|触点离开前, 按压移动的距离超过10px才能触发事件|
|velocity| `Number`|0.3|快划超过30px/ms才触发事件|