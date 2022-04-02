# @any-touch/swipe
**快划**识别器.

## 安装
```shell
npm i -S @any-touch/swipe
```

## 快速开始
```javascript
// 只加载rotate识别器(旋转)
import Core from '@any-touch/core';
import swipe from '@any-touch/swipe';
const at = new Core(el);
at.use(swipe, 参数)

// 旋转
at.on('swipe', (event) => {
    // event包含位置/速度/方向等信息
});
```

## 参数
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'swipe'|自定义事件名称|
|pointLength|`Number`|1|支持的触点数, 可支持多指触发|
|threshold| `Number`|10|触点离开前, 按压移动的距离超过10px才能触发事件|
|velocity| `Number`|0.3|快划超过30px/ms才触发事件|