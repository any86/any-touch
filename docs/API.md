## API

### AnyTouch

#### constructor(HTMLElement, [options]);
初始化设置
```javascript
// 设置
const options = {
    touchAction: 'compute',
    domEvents: true,
    isPreventDefault: false,
    style: {}
};
// 初始化
const el = doucument.getElementById('box');
const at = new AnyTouch(el, options);
```
|名称|类型|默认值|说明|
|---|---|---|---|
|touchAction|`String`|'compute'|元素css的**touch-action**属性, compute代表由系统根据加载的手势计算, 其他值为为不同css设置.|
|domEvents|`Boolean`|true|是否触发dom事件|
|isPreventDefault|`Boolean`|false|是否阻止默认事件|
|style|`Object`|[查看更多]()|一些提高操作流程体验的样式|

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

#### recognizers
存储识别器, 本身为数组, 默认顺序为: 
Rotate -> Pinch -> Pan -> Swipe -> Tap -> Press
```javascript
console.log(at.recognizers);
```
![](https://ws1.sinaimg.cn/large/005IQkzXly1g1e0kz9qt3j30dq03bmxg.jpg)

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

### AnyTouch.Pan
**拖拽**识别器
#### AnyTouch.Pan.constructor([options])
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'pan'|识别器名称,可供其他方法快捷调用, 如: `anyTouch.remove('pan')`|
|pointLength|`Number`|支持的触点数|'pan'|过滤非pointLength个数的触点输入|
|threshold| `Number`|10|超过10px, 才开始识别|
|directions| `Array`|['up', 'right', 'down', 'left']|支持的方向|

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

### 识别器公有方法和属性
Rotate/ Pinch/ Pan/ Swipe/ Tap/ Press上均存在下列方法和属性.

#### requireFailure(recognizer)
在指定识别器识别失败后才可以开始识别, 如单击需要等待双击的成功或失败来决定是否执行.
``` javascript
// 自定义一个双击识别器
const tap2 = new AnyTouch.Tap({
    name: 'doubletap',
    pointLength: 1,
    taps: 2
});

// 添加自定义手势 
const el = doucument.getElementById('gesture-box');
const at = new AnyTouch(el);
at.add(tap2);
at.on('doubletap', ev=>{
    console.log(ev);
});

// 一般情况下不期望双击时触发单击, 
// 所以要声明单击的触发一定要等待(一段时间内)双击没有触发(失败)才可以
const tap1 = anyTouch.get('tap');
tap1.requireFailure(tap2);
```
