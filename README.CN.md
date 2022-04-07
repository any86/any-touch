# any-touch [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![size-image]][size-url] [![codecov](https://codecov.io/gh/any86/any-touch/branch/master/graph/badge.svg)](https://codecov.io/gh/any86/any-touch) [![CircleCI](https://circleci.com/gh/any86/any-touch.svg?style=svg)](https://circleci.com/gh/any86/any-touch)

[size-image]: https://badgen.net/bundlephobia/minzip/@any-touch/core
[size-url]: https://bundlephobia.com/result?p=@any-touch/core
[npm-image]: https://badgen.net/npm/v/any-touch
[npm-url]: https://npmjs.org/package/any-touch
[downloads-image]: https://badgen.net/npm/dt/any-touch
[downloads-url]: https://npmjs.org/package/any-touch

![6类手势](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/102a244991064824900ac45efeb9251d~tplv-k3u1fbpfcp-zoom-1.image)

-   支持 PC 端 / 移动端 / [微信小程序](docs/wx.CN.md).
-   **默认加载6 个手势识别器**, 也可[按需加载](docs/optional.CN.md), 核心**1kb**, 完整**5kb**.
-   **无依赖, 不限于 Vue / React / Angular 等...**

## 语言
 **中文** | [English](README.CN.md)

## 演示

<details>
<summary>查看二维码</summary>
<img src="https://user-images.githubusercontent.com/8264787/104836031-a55ca780-58e5-11eb-936a-7e2d1a05ee86.png" />
</details>

[简单演示](https://any86.github.io/any-touch)

[衍生产物: any-scroll(虚拟滚动)](https://github.com/any86/any-scroll)

## 安装

```javascript
npm i -S any-touch
```

## CDN

```html
<script src="https://unpkg.com/any-touch/dist/any-touch.umd.min.js"></script>
<script>
    console.log(AnyTouch.version); // 2.x.x
</script>
```

## 目录

[⚡ 快速开始](#快速开始)

-   [👋 手势事件](#-手势事件)
-   [🍭 事件对象](#lollipop-事件对象event)
-   [🔹 Typescript](#Typescript)

[🌱 vue&指令](docs/vue.CN.md)

[🍀 微信小程序](docs/wx.CN.md)

[📐 按需加载](docs/optional.CN.md)

[🌈 进阶使用](docs/advanced.CN.md)

-   [阻止默认事件](docs/advanced.CN.md#阻止默认事件)
-   [双击(doubletap)](https://github.com/any86/any-touch/tree/master/packages/doubletap)

[:bulb: API](docs/API.CN.md)

[🍳 常见问题](docs/question.CN.md)


## 快速开始

```javascript
import AnyTouch from 'any-touch';

// 被监视的元素
const el = document.getElementById('box');

// 开始监视el上的手势变化
const at = new AnyTouch(el);

// 当拖拽的时候pan事件触发
at.on('pan', (e) => {
    // e包含位移/速度/方向等信息
    console.log(e);
});
```

这里的`pan`叫做[手势事件](#-手势事件). `e`是[事件对象](#lollipop-事件对象event), 其包含"位置/速度/缩放/角度"等数据,

### 👋 手势事件

每个手势的不同状态都对应一个事件.

<table>
    <tr>
        <td>手势</td>
        <td>事件名</td>
        <td>说明</td>
    </tr>
    <tr>
        <td rowspan="5"></td>
        <td>pan</td>
        <td>拖拽时持续触发</td>
    </tr>
    <tr>
        <td>panstart</td>
        <td>拖拽开始</td>
    </tr>   
    <tr>
        <td>panmove</td>
        <td>拖拽中</td>
    </tr>  
    <tr>
        <td>panstart</td>
        <td>拖拽停止(离开屏幕)</td>
    </tr>  
    <tr>
        <td>panup / pandown / panright / panleft</td>
        <td>不同方向的拖拽事件</td>
    </tr>
    <tr>
        <td rowspan="2">press</td>
        <td>press</td>
        <td>按压</td>
    </tr>  
        <tr>
        <td>press</td>
        <td>按压释放(离开屏幕)</td>
    </tr>     
    <tr>
        <td>tap</td>
        <td>tap</td>
        <td>点击</td>
    </tr>  
    <tr>
        <td rowspan="2">swipe</td>
        <td>swipe</td>
        <td>快划</td>
    </tr>  
    <tr>
        <td> swipeup / swipedown / swiperight / swipeleft</td>
        <td>不同方向快划</td>
    </tr>  
    <tr>
        <td rowspan="6">pinch</td>
        <td>pinch</td>
        <td>缩放</td>
    </tr>  
    <tr>
        <td> pinchstart </td>
        <td>缩放开始</td>
    </tr>  
    <tr>
        <td> pinchmove </td>
        <td>缩放中</td>
    </tr>  
    <tr>
        <td> pinchend </td>
        <td>缩放结束(离开屏幕)</td>
    </tr>  
        <tr>
        <td> pinchin </td>
        <td>放大</td>
    </tr>  
        <tr>
        <td> pinchout </td>
        <td>缩小</td>
    </tr>
    <tr>
        <td rowspan="6">rotate</td>
        <td>rotate</td>
        <td>旋转</td>
    </tr>  
    <tr>
        <td> rotatestart </td>
        <td>旋转开始</td>
    </tr>  
    <tr>
        <td> rotatemove </td>
        <td>旋转中</td>
    </tr>  
    <tr>
        <td> rotateend </td>
        <td>旋转结束(离开屏幕)</td>
    </tr>

</table>

#### 组合事件

可以通过数组监听多个事件, 比如同时监听`panleft`和`panright`, 这样就实现监听"x 轴拖拽".

```javascript
at.on(['panleft', 'panright'], () => {
    console.log('x轴拖拽');
});
```

[:rocket: 返回目录](#目录)

### :lollipop: 事件对象(event)

事件触发的时候, 可以获取"位置/速度/缩放/角度"等数据.

```javascript
at.on('pan', (event) => {
    // event包含速度/方向等数据
});
```

#### event

| 名称            | 数据类型        | 说明                                                                                                                     |
| --------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| name            | `String`        | **识别器名**, 如:pan/tap/swipe等.                                                                                      |
| type            | `String`        | **事件名**,如 tap/panstart 等,他比`name`字段范围大,如:当`type`是 panstart 或 panmove, 而`name`返回的都是 pan             |
| phase           | `String`        | 当前触碰状态: start \| move \|end \| cancel 对应: 第一下触碰 \| 屏幕上移动 \| 离开屏幕 \| 非正常离开 \"可 anyTouch\"元素 |
| x               | `Number`        | **当前触点中心**x 坐标                                                                                                   |
| y               | `Number`        | **当前触点中心**y 坐标                                                                                                   |
| deltaX          | `Number`        | **当前触点**和**前触点**的 x 轴偏移距离                                                                                  |
| deltaY          | `Number`        | **当前触点**和**前触点**的 y 轴偏移距离                                                                                  |
| displacementX   | `Number`        | **当前触点**与**起始触点**的 x 位移(矢量)                                                                                |
| displacementY   | `Number`        | **当前触点**与**起始触点**的 y 位移(矢量)                                                                                |
| distanceX       | `Number`        | displacementX 的绝对值                                                                                                   |
| distanceY       | `Number`        | displacementY 的绝对值                                                                                                   |
| distance        | `Number`        | **当前触点**与**起始触点**的距离(标量)                                                                                   |
| deltaTime       | `Number`        | **当前时间**与**起始触碰时间**的差值                                                                                     |
| velocityX       | `Number`        | 当前 x 轴速度                                                                                                            |
| velocityY       | `Number`        | 当前 y 轴速度                                                                                                            |
| direction       | `Number`        | **前触点**与**当前触点**的方向,可以理解为瞬时方向                                                                        |
| angle           | `Number`        | 多点触摸时,**起始触点**与**当前触点**的旋转角度                                                                          |
| deltaAngle      | `Number`        | 多点触摸时,**前触点**与**当前触点**的旋转角度                                                                            |
| scale           | `Number`        | 多点触摸时,**起始触点**与**当前触点**的缩放比例                                                                          |
| deltaScale      | `Number`        | 多点触摸时,**前触点**与**当前触点**的缩放比例                                                                            |
| maxPointLength  | `Number`        | 本轮识别周期出现过的最大触点数                                                                                           |
| isStart         | `Boolean`       | 是否当前识别周期的开始, 规律为从 touchstart->touchend 即是一个周期, 即便多点触碰, 有一个点离开,本轮识别结束              |
| isEnd           | `Boolean`       | 是否当前识别周期的结束                                                                                                   |
| target          | `EventTarget`   | 绑定事件的元素                                                                                                           |
| targets         | `EventTarget[]` | 对应多个触点会存储 touches 中的每一个 target                                                                             |
| currentTarget   | `EventTarget`   | 实际触发绑定事件的元素                                                                                                   |
| **nativeEvent** | `TouchEvent`    | 原生事件对象                                                                                                             |

[:rocket: 返回目录](#目录)

## Typescript

如果在 vue 模板中绑定事件函数, 那么事件对象的类型是没法推导的, 所以需要我们自己手动标注.

```html
<div @tap="onTap"></div>
```

```typescript
// xxx.vue
import type { AnyTouchEvent } from 'any-touch';
function onTap(e: AnyTouchEvent) {
    // 可以正确推导出e上有x属性
    console.log(e.x);
}
```

[:rocket: 返回目录](#目录)
