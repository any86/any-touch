# @any-touch/rotate
**旋转**识别器.

## 安装
```shell
npm i -S @any-touch/rotate
```


## 快速开始
```javascript
// 只加载rotate识别器(拖拽)
import Core from '@any-touch/core';
import rotate from '@any-touch/rotate';
const at = new Core(el);
at.use(rotate, 参数);

// 拖拽
at.on('rotate', (event) => {
    // event包含位置/速度/方向等信息
});
```

## 参数
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'rotate'|自定义事件名称|
|pointLength|`Number`|2|支持的触点数, 可支持多指拖拽|
|threshold| `Number`|0|旋转超过0°才触发rotate事件|