# @any-touch/pinch
**缩放**识别器.

## 安装
```shell
npm i -S @any-touch/pinch
```

## 快速开始
```javascript
// 只加载pinch识别器(拖拽)
import Core from '@any-touch/core';
import pinch from '@any-touch/pinch';
const at = new Core(el);
at.use(pinch, 参数)

// 缩放
at.on('pinch', (event) => {
    // event包含位置/速度/方向等信息
});
```

## 参数
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'pinch'|自定义事件名称|
|pointLength|`Number`|2|支持的触点数, 可支持多指拖拽|
|threshold| `Number`|0|缩放超过0倍才触发pinch事件|