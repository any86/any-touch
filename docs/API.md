## API

### AnyTouch

#### constructor(HTMLElement, [options]);
初始化设置
```javascript
// 设置
const options = {
    domEvents: true,
    isPreventDefault: false,
};
// 初始化
const el = doucument.getElementById('box');
const at = new AnyTouch(el, options);
```
## 参数

| 名称| 类型| 默认值 | 简要说明                                     |
| --- | --- | --- |--- |
| domEvents | `Boolean` | `true`| 是否派发手势名对应的原生事件|
| preventDefaultExclude | `RegExp \| Function` | `/^(INPUT\|TEXTAREA\|BUTTON\|SELECT)$/`                            | 符合条件可不阻止默认事件的触发               |
#### on(eventName, listener)
事件监听
```javascript
at.on('tap', ev=>{
    console.log(ev.type);
    // 输出: 'tap'
});
```

#### set(options)
改变设置
```javascript
at.set({isPreventDefault: true});
```

#### remove(recognizerName)
删除识别器
```javascript
at.remove('pan');
at.on('pan', ev=>{
    // 不会执行到这里的代码
});
```

#### stop
阻止后续的识别器执行.
```javascript
at.on('rotate', ()=>{
  at.stop();
  // 注册在rotate后面的识别器就不会运行了.
  // 注意stop方法在实例上.
});
```

### AnyTouch.Tap
**点击**识别器

#### AnyTouch.Tap.constructor([options])
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'tap'|识别器名称,可供其他方法快捷调用, 如: `anyTouch.remove('tap')`|
|pointLength|`Number`|支持的触点数|'tap'|过滤非pointLength个数的触点输入|
|tapTimes|`Number`| 1 | 过滤非tapTimes次数的点击的输入|
|waitNextTapTime|`Number`|300| 等待下一次点击的时间, 单位ms|
|positionTolerance| `Number`|2|触点发生位移的最大容差|
|tapsPositionTolerance| `Number`|9|2次点击之间发生的位移的容差|
|maxPressTime| `Number`|250|按住屏幕超过250ms即判定为失败(取值和Press识别器的**minPressTime**有关联性)|

### AnyTouch.Press
**按压**识别器

#### AnyTouch.Press.constructor([options])
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'press'|识别器名称,可供其他方法快捷调用, 如: `anyTouch.remove('press')`|
|pointLength|`Number`|支持的触点数|'press'|过滤非pointLength个数的触点输入|
|positionTolerance| `Number`|2|触点发生位移的最大容差|
|minPressTime| `Number`|251|按住屏幕超过251ms才算识别成功|



### AnyTouch.Swipe
**划**识别器
#### AnyTouch.Swipe.constructor([options])
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'swipe'|识别器名称,可供其他方法快捷调用, 如: `anyTouch.remove('swipe')`|
|pointLength|`Number`|支持的触点数|过滤非pointLength个数的触点输入|
|velocity|`Number`|0.3|速度超过0.3px/ms, 才可开始识别|
|threshold| `Number`|10|滑动距离超过10px, 才开始识别|
|directions| `Array`|['up', 'right', 'down', 'left']|支持的方向|

### AnyTouch.Pinch
**缩放**识别器
#### AnyTouch.Pinch.constructor([options])
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'pinch'|识别器名称,可供其他方法快捷调用, 如: `anyTouch.remove('pinch')`|
|pointLength|`Number`|支持的触点数|过滤非pointLength个数的触点输入|
|threshold|`Number`|0|触发事件所需要的最小缩放比例|

### AnyTouch.Rotate
**旋转**识别器
#### AnyTouch.Rotate.constructor([options])
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'rotate'|识别器名称,可供其他方法快捷调用, 如: `anyTouch.remove('rotate')`|
|pointLength|`Number`|支持的触点数|过滤非pointLength个数的触点输入|
|threshold|`Number`|0|触发事件所需要的最小角度|