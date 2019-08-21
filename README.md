# any-touch  [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![npm bundle size (minified + gzip)][size-image]][size-url] [![codecov](https://codecov.io/gh/any86/any-touch/branch/develop/graph/badge.svg)](https://codecov.io/gh/any86/any-touch)  [![CircleCI](https://circleci.com/gh/any86/any-touch.svg?style=svg)](https://circleci.com/gh/any86/any-touch)


[size-image]: https://img.shields.io/bundlephobia/minzip/any-touch.svg
[size-url]: https://bundlephobia.com/result?p=any-touch
[npm-image]: https://img.shields.io/npm/v/any-touch.svg
[npm-url]: https://npmjs.org/package/any-touch

[downloads-image]: https://img.shields.io/npm/dm/any-touch.svg
[downloads-url]: https://npmjs.org/package/any-touch


:wave:  一个手势库, 支持mouse和touch, 支持自定义手势.

## 直达
[快速开始](#快速开始)

[:iphone:支持微信小程序](#支持微信小程序)

[更多实例](#更多实例)

[API](docs/API.md)


## 安装
```javascript
npm i -S any-touch
```

## CDN
```
https://unpkg.com/any-touch
```

## 快速开始
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

## 支持哪些手势?
#### tap(点击)
还支持: **doubletap**(双击), 以及可以自定义任意多击.

#### press(按)
还支持: **pressup**(按后松手)

#### pan(拖拽)
还支持衍生事件: **panstart**(拖拽开始)/**panmove**(拖拽中)/**panend**(拖拽结束)/**panleft**(向左拖拽)/**panright**/**panup**/**pandown**

#### pinch(缩放)
还支持: **pinchstart**(缩放开始)/**pinchmovet**(缩放中)/**pinchend**(缩放结束)/**pinchin**(缩小)/**pinchout**(放大)

#### rotate(旋转)
还支持: **rotatestart**(旋转开始)/**rotatemove**(旋转中)/**rotateend**(旋转结束)

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
|maxPointLength|`Number`|本轮识别周期出现过的最大触点数|
|isStart|`Boolean`|是否当前识别周期的开始|
|isEnd|`Boolean`|是否当前识别周期的结束|
|target|`EventTarget`|绑定事件的元素|
|currentTarget|`EventTarget`|实际触发绑定事件的元素|
|timestamp|`Number`|**当前时间**|
|**nativeEvent**|`TouchEvent`|MouseEvent`|原生事件对象|


## 支持微信小程序
由于微信小程序中没有dom元素的概念, 所以我们需要通过直接接受touch事件的事件对象
```xml
<view @touchstart="touchstartHandler" @touchmove="touchmoveHandler" @touchend="touchendHandler"></view>
```

```javascript
const at = new AnyTouch();
{
    onload(){
        at.on('pan', ev=>{
            // 拖拽
        });
    },

    methods:{
       touchstartHandler(ev){
           at.useEvent(ev);
       },

       touchmoveHandler(ev){
           at.useEvent(ev);
       },

       touchendHandler(ev){
           at.useEvent(ev);
       }
    }
}
```

## 更多实例
[基础](https://codepen.io/russell2015/pen/rRmQaw#)

[自定义手势-双击](https://codepen.io/russell2015/pen/xBrgjJ)

[全部手势展示](https://any86.github.io/any-touch/example/)

[drawer效果](https://codepen.io/russell2015/pen/jJRbgp?editors=0010)


## 概念

### 识别器
**识别器**就是识别如下手势的代码逻辑: 点击(tap) | 拖拽(pan) | 划(swipe) | 捏合缩放(pinch) | 旋转(rotate).

### requireFailure
如果你需要某2个手势的触发条件是互斥的, 那么就需要通过requireFailure来标记他们, 当一个"识别失败"另一个才能触发, 如[单击和双击](#requireFailure)就是互斥关系的2个手势.