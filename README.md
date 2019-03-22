# any-touch  [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![npm bundle size (minified + gzip)][size-image]][size-url] [![codecov](https://codecov.io/gh/383514580/any-touch/branch/develop/graph/badge.svg)](https://codecov.io/gh/383514580/any-touch)  [![CircleCI](https://circleci.com/gh/383514580/any-touch.svg?style=svg)](https://circleci.com/gh/383514580/any-touch)

:wave:    一个手势库

[size-image]: https://img.shields.io/bundlephobia/minzip/any-touch.svg
[size-url]: https://bundlephobia.com/result?p=any-touch
[npm-image]: https://img.shields.io/npm/v/any-touch.svg
[npm-url]: https://npmjs.org/package/any-touch

[downloads-image]: https://img.shields.io/npm/dm/any-touch.svg
[downloads-url]: https://npmjs.org/package/any-touch

## 核心功能
- [x] 支持手势: 点击(tap) | 拖拽(pan) | 划过(swipe) | 捏合缩放(pinch) | 旋转(rotate).
- [x] 支持鼠标(mouse)和移动设备(touch)

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

// 初始化
const el = doucument.getElementById('gesture-box');
const at = new AnyTouch(el);

// 单击
at.on('tap', ev=>{
    console.log(ev);
});

// 拖拽
at.on('pan', ev=>{
    console.log(ev);
});

// 快速划
at.on('swipe', ev=>{
    console.log(ev);
});

// 缩放
at.on('pinch', ev=>{
    console.log(ev);
});

// 旋转
at.on('rotate', ev=>{
    console.log(ev);
});
```

### 手势扩展
根据状态和方向的不同, 还有更具体的事件.
#### press
pressup: press触发后, 触点移开触发.

#### pan
panstart/panmove/panend/panleft/panright/panup/pandown

#### pinch
pinchstart/pinchmove/pinchend

#### rotate
rotatestart/rotatemove/rotateend

### 事件对象(ev)
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

### 自定义识别器
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

## API
### stop
阻止后续的识别器(tap/pan/rotate等)进行识别.
```javascript

// 通过recognizers属性, 我们可以知道识别器的顺序.
// 默认pinch在rotate后面
console.log(at.recognizers);
at.on('rotate', ()=>{
  // 后面的识别器就不会运行了.
  // 注意stop方法在实例上.
  at.stop();
});
```


