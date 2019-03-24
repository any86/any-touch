# any-touch  [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![npm bundle size (minified + gzip)][size-image]][size-url] [![codecov](https://codecov.io/gh/383514580/any-touch/branch/develop/graph/badge.svg)](https://codecov.io/gh/383514580/any-touch)  [![CircleCI](https://circleci.com/gh/383514580/any-touch.svg?style=svg)](https://circleci.com/gh/383514580/any-touch)


[size-image]: https://img.shields.io/bundlephobia/minzip/any-touch.svg
[size-url]: https://bundlephobia.com/result?p=any-touch
[npm-image]: https://img.shields.io/npm/v/any-touch.svg
[npm-url]: https://npmjs.org/package/any-touch

[downloads-image]: https://img.shields.io/npm/dm/any-touch.svg
[downloads-url]: https://npmjs.org/package/any-touch


:wave:  一个手势库, 支持mouse和touch, 支持自定义手势.

## 直达
[例子](#例子)

[安装](#安装)

[CDN](#CDN)

[开始](#开始)

[API](#API)


## 概念

### 识别器
**识别器**就是识别如下手势的代码逻辑: 点击(tap) | 拖拽(pan) | 划(swipe) | 捏合缩放(pinch) | 旋转(rotate).

### requireFailure
如果你需要某2个手势的触发条件是互斥的, 那么就需要通过requireFailure来标记他们, 当一个"识别失败"另一个才能触发, 如[单击和双击](#requireFailure)就是互斥关系的2个手势.

## 例子
[基础](https://codepen.io/russell2015/pen/rRmQaw#)

[自定义手势-双击](https://codepen.io/russell2015/pen/xBrgjJ)

[全部手势展示](https://383514580.github.io/any-touch/example/)


## 安装
```javascript
npm i -S any-touch
```

## CDN
```
https://unpkg.com/any-touch
```

## 开始
```javascript
import AnyTouch from 'any-touch';
const el = doucument.getElementById('box');
const at = new AnyTouch(el);
// 单击
at.on('tap', ev=>{
    // 阻止默认事件触发, 比如click
    ev.preventDefault();
});
```

## 还有哪些手势?
根据状态和方向的不同, 还有更具体的事件.
#### press
pressup: press触发后, 触点移开触发.

#### pan
panstart/panmove/panend/panleft/panright/panup/pandown

#### pinch
pinchstart/pinchmove/pinchend

#### rotate
rotatestart/rotatemove/rotateend

## 事件对象(ev)
|名称|数据类型|说明
|---|---|---|
|type|`String`|事件名, 如tap/pan等|
|eventType|`String`|事件类型: start|move|end|cancel|
|x|`Number`|**当前触点**x坐标|
|y|`Number`|**当前触点**y坐标|
|deltaX|`Number`|**当前触点**和**前触点**的x轴偏移距离|
|deltaY|`Number`|**当前触点**和**前触点**的y轴偏移距离|
|deltaXYAngle|`Number`|**当前触点**相对**前触点**的角度变化(相对于x轴)|
|displacementX|`Number`|**当前触点**与**起始触点**的x位移(矢量)|
|displacementY|`Number`|**当前触点**与**起始触点**的y位移(矢量)|
|distanceX|`Number`|displacementX的绝对值|
|distanceY|`Number`|displacementY的绝对值|
|distance|`Number`|**当前触点**与**起始触点**的距离(标量)|
|deltaTime|`Number`|**当前时间**与**起始时间**的差值|
|velocityX|`Number`|当前x速度, 每25ms进行一次刷新|
|velocityY|`Number`|当前y速度, 每25ms进行一次刷新|
|direction|`Number`|**前触点**与**当前触点**的方向, 可以理解为瞬时方向, 每25ms进行一次刷新|
|overallDirection|`String`|`是否当前识别周期的开始`|
|angle|`Number`|多点触摸时, **起始触点**与**当前触点**的旋转角度|
|deltaAngle|`Number`|多点触摸时, **前触点**与**当前触点**的旋转角度|
|scale|`Number`|多点触摸时, **起始触点**与**当前触点**的缩放比例|
|deltaScale|`Number`|多点触摸时, **前触点**与**当前触点**的缩放比例|
|maxpointLength|`Number`|本轮识别周期出现过的最大触点数|
|isFirst|`Boolean`|是否当前识别周期的开始|
|isFinal|`Boolean`|是否当前识别周期的结束|
|target|`EventTarget`|绑定事件的元素|
|currentTarget|`EventTarget`|实际触发绑定事件的元素|
|timestamp|`Number`|**当前时间**|
|**nativeEvent**|`TouchEvent`|MouseEvent`|原生事件对象|

## API

### AnyTouch

#### constructor(HTMLElement, [options]);
初始化设置
```javascript
// 设置
const options = {
    touchAction: 'compute',
    hasDomEvents: true,
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
|hasDomEvents|`Boolean`|true|是否触发dom事件|
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
at.set({isPreventDefault: true'});
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
|name|`String`|'tap'|识别器名称,可供其他方法快捷调用, 如: `anyTouch.remove('tap)`|
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
|name|`String`|'tap'|识别器名称,可供其他方法快捷调用, 如: `anyTouch.remove('tap)`|
|pointLength|`Number`|支持的触点数|'tap'|过滤非pointLength个数的触点输入|
|positionTolerance| `Number`|2|触点发生位移的最大容差|
|minPressTime| `Number`|251|按住屏幕超过251ms才算识别成功|

### AnyTouch.Pan
**拖拽**识别器
#### AnyTouch.Pan.constructor([options])
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'tap'|识别器名称,可供其他方法快捷调用, 如: `anyTouch.remove('tap)`|
|pointLength|`Number`|支持的触点数|'tap'|过滤非pointLength个数的触点输入|
|threshold| `Number`|10|超过10px, 才开始识别|
|directions| `Array`|['up', 'right', 'down', 'left']|支持的方向|

### AnyTouch.Swipe
**划**识别器
#### AnyTouch.Swipe.constructor([options])
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'tap'|识别器名称,可供其他方法快捷调用, 如: `anyTouch.remove('tap)`|
|pointLength|`Number`|支持的触点数|'tap'|过滤非pointLength个数的触点输入|
|velocity|`Number`|0.3|速度超过0.3px/ms, 才可开始识别|
|threshold| `Number`|10|超过10px, 才开始识别|
|directions| `Array`|['up', 'right', 'down', 'left']|支持的方向|

### AnyTouch.Pinch
**啮合**识别器
#### AnyTouch.Pinch.constructor([options])
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'tap'|识别器名称,可供其他方法快捷调用, 如: `anyTouch.remove('tap)`|
|pointLength|`Number`|支持的触点数|'tap'|过滤非pointLength个数的触点输入|
|threshold|`Number`|0|触发事件所需要的最小缩放比例|

### AnyTouch.Rotate
**啮合**识别器
#### AnyTouch.Rotate.constructor([options])
|名称|数据类型|默认值|说明|
|---|---|---|---|
|name|`String`|'tap'|识别器名称,可供其他方法快捷调用, 如: `anyTouch.remove('tap)`|
|pointLength|`Number`|支持的触点数|'tap'|过滤非pointLength个数的触点输入|
|threshold|`Number`|0|触发事件所需要的最小角度|

### 识别器通用方法和属性
Rotate/ Pinch/ Pan/ Swipe/ Tap/ Press上均存在下列方法和属性.

#### requireFailure(recognizer)
在指定识别器识别失败后才可以开始识别, 如单击需要等待双击的成功或失败来决定是否执行.
``` javascript
// 自定义一个双击识别器
const tap2 = new AnyTouch.Tap({
    name: 'doubletap',
    pointer: 1,
    taps: 2
});

// 添加自定义手势 
const el = doucument.getElementById('gesture-box');
const at = new AnyTouch(el);
at.add(tap2);
at.on('tap2', ev=>{
    console.log(ev);
});

// 一般情况下不期望双击时触发单击, 
// 所以要声明单击的触发一定要等待(一段时间内)双击没有触发(失败)才可以
const tap1 = anyTouch.get('tap');
tap1.requireFailure(tap2);
```
