# @any-touch/pan
**拖拽**识别器.

## 安装
```shell
npm i -S @any-touch/pan
```

## 快速开始
```javascript
// 只加载pan识别器(拖拽)
import Core from '@any-touch/core';
import pan from '@any-touch/pan';
const at = new Core(el);
at.use(pan, 参数)

// 拖拽
at.on('pan', (event) => {
    // event包含位置/速度/方向等信息
});
```

## 参数
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'pan'|自定义事件名称|
|pointLength|`Number`|1|支持的触点数, 可支持多指拖拽|
|threshold| `Number`|10|拖拽超过10px后触发pan事件|