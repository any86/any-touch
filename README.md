# any-touch [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![size-image]][size-url] [![codecov](https://codecov.io/gh/any86/any-touch/branch/develop/graph/badge.svg)](https://codecov.io/gh/any86/any-touch) [![CircleCI](https://circleci.com/gh/any86/any-touch.svg?style=svg)](https://circleci.com/gh/any86/any-touch)

[size-image]: https://badgen.net/bundlephobia/minzip/any-touch
[size-url]: https://bundlephobia.com/result?p=any-touch
[npm-image]: https://badgen.net/npm/v/any-touch
[npm-url]: https://npmjs.org/package/any-touch
[downloads-image]: https://badgen.net/npm/dt/any-touch
[downloads-url]: https://npmjs.org/package/any-touch

:wave: 一个手势库, 支持 / 鼠标 / touch/ 微信小程序

## 直达

[快速开始](#快速开始)

[:iphone:支持微信小程序](#支持微信小程序)

[支持vue指令](#支持vue指令)

[更多实例](#更多实例)

[API](docs/API.md)

## 安装

```javascript
npm i -S any-touch
```

## CDN

```
https://unpkg.com/any-touch/dist/AnyTouch.umd.min.js
```

## 快速开始

```javascript
import AnyTouch from "any-touch";
const el = doucument.getElementById("box");
const at = new AnyTouch(el);
// 单击
at.on("tap", ev => {
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

| 名称             | 数据类型      | 说明                                                                     |
| ---------------- | ------------- | ------------------------------------------------------------------------ |
| type             | `String`      | 事件名, 如 tap/pan 等                                                    |
| eventType        | `String`      | 事件类型: start                                                          | move | end | cancel |
| x                | `Number`      | **当前触点中心**x坐标                                                       |
| y                | `Number`      | **当前触点中心**y 坐标                                                       |
| deltaX           | `Number`      | **当前触点**和**前触点**的 x 轴偏移距离                                  |
| deltaY           | `Number`      | **当前触点**和**前触点**的 y 轴偏移距离                                  |
| deltaXYAngle     | `Number`      | **当前触点**相对**前触点**的角度变化(相对于 x 轴)                        |
| displacementX    | `Number`      | **当前触点**与**起始触点**的 x 位移(矢量)                                |
| displacementY    | `Number`      | **当前触点**与**起始触点**的 y 位移(矢量)                                |
| distanceX        | `Number`      | displacementX 的绝对值                                                   |
| distanceY        | `Number`      | displacementY 的绝对值                                                   |
| distance         | `Number`      | **当前触点**与**起始触点**的距离(标量)                                   |
| deltaTime        | `Number`      | **当前时间**与**起始时间**的差值                                         |
| velocityX        | `Number`      | 当前 x 速度, 每 25ms 进行一次刷新                                        |
| velocityY        | `Number`      | 当前 y 速度, 每 25ms 进行一次刷新                                        |
| direction        | `Number`      | **前触点**与**当前触点**的方向, 可以理解为瞬时方向, 每 25ms 进行一次刷新 |
| overallDirection | `String`      | `是否当前识别周期的开始`                                                 |
| angle            | `Number`      | 多点触摸时, **起始触点**与**当前触点**的旋转角度                         |
| deltaAngle       | `Number`      | 多点触摸时, **前触点**与**当前触点**的旋转角度                           |
| scale            | `Number`      | 多点触摸时, **起始触点**与**当前触点**的缩放比例                         |
| deltaScale       | `Number`      | 多点触摸时, **前触点**与**当前触点**的缩放比例                           |
| maxPointLength   | `Number`      | 本轮识别周期出现过的最大触点数                                           |
| isStart          | `Boolean`     | 是否当前识别周期的开始                                                   |
| isEnd            | `Boolean`     | 是否当前识别周期的结束                                                   |
| target           | `EventTarget` | 绑定事件的元素                                                           |
| currentTarget    | `EventTarget` | 实际触发绑定事件的元素                                                   |
| timestamp        | `Number`      | **当前时间**                                                             |
| **nativeEvent**  | `TouchEvent`  | MouseEvent`|原生事件对象                                                 |

## 支持微信小程序

由于微信小程序中没有 dom 元素的概念, 所以我们需要通过`useEvent`方法手动接收 touch 事件的事件对象来进行识别!

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

## 支持vue指令
AnyTouch上的vTouch是一个vue指令, 初始化后可以在元素上添加`v-touch`进行绑定.

```javascript
// main.js
Vue.use(AnyTouch.vTouch);
```

```html
<!-- xxx.vue -->
<div v-touch="importAT" 
    @tap="tap" 
    @doubletap="doubletap"
    @press="press" 
    @pan="pan" 
    @pinch="pinch" 
    @rotate="rotate" 
    @click="click">touch</div>
```
此时`div`上可以通过`@/v-on`进行手势的绑定,和绑定click等原生事件一样. 通过`v-touch`我们还可以导出`AnyTouch`的实例.

[示例](https://any86.github.io/any-touch/example/vue/)

## 更多实例

[基础](https://codepen.io/russell2015/pen/rRmQaw#)

[自定义手势-双击](https://codepen.io/russell2015/pen/xBrgjJ)

[全部手势展示](https://any86.github.io/any-touch/example/)

[drawer 效果](https://codepen.io/russell2015/pen/jJRbgp?editors=0010)

## 概念

### 识别器

**识别器**就是识别如下手势的代码逻辑: 点击(tap) | 拖拽(pan) | 划(swipe) | 捏合缩放(pinch) | 旋转(rotate).

### requireFailure

如果你需要某 2 个手势的触发条件是互斥的, 那么就需要通过 requireFailure 来标记他们, 当一个"识别失败"另一个才能触发, 如[单击和双击](#requireFailure)就是互斥关系的 2 个手势.
