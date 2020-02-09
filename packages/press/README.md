# @any-touch/press
🤖 **按压**识别器.

## 快速开始
```javascript
// 只加载press识别器(按压)
import Core from '@any-touch/core';
import Press from '@any-touch/press';
Core.use(Press, 参数)
const at = new Core(el);
// 按压
at.on('press', (ev) => {
    // ev包含位置/速度/方向等信息
});
```
**⚠️注意**: 执行`npm i any-touch`后, **@any-touch/core和@any-touch/press**便已自动安装, 直接引入即可.

## 参数
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'press'|自定义事件名称|
|pointLength|`Number`|1|支持的触点数, 可支持多指按压|
|maxDistance| `Number`|9|触点允许移动的最大距离|
|minPressTime| `Number`|251|触发事件需要按压的最小时间|
