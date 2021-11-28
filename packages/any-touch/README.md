# any-touch [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![size-image]][size-url] [![codecov](https://codecov.io/gh/any86/any-touch/branch/master/graph/badge.svg)](https://codecov.io/gh/any86/any-touch) [![CircleCI](https://circleci.com/gh/any86/any-touch.svg?style=svg)](https://circleci.com/gh/any86/any-touch)

[size-image]: https://badgen.net/bundlephobia/minzip/@any-touch/core
[size-url]: https://bundlephobia.com/result?p=@any-touch/core
[npm-image]: https://badgen.net/npm/v/any-touch
[npm-url]: https://npmjs.org/package/any-touch
[downloads-image]: https://badgen.net/npm/dt/any-touch
[downloads-url]: https://npmjs.org/package/any-touch

![6类手势](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/102a244991064824900ac45efeb9251d~tplv-k3u1fbpfcp-zoom-1.image)

-   支持 PC 端 / 移动端 / [微信小程序](#支持微信小程序).
-   默认加载**6 个手势**, 也可[按需加载](#按需加载)手势, 核心小于**2kb**, 完整小于**5kb**.
-   **无依赖, 不限于 Vue / React / Angular等...**

## 演示

<details>
<summary>查看二维码</summary>
<img src="https://user-images.githubusercontent.com/8264787/104836031-a55ca780-58e5-11eb-936a-7e2d1a05ee86.png" />
</details>

[直接访问](https://any86.github.io/any-touch)

## 目录

[:zap: 快速开始](#快速开始)
- [纯js插件, 无依赖](#快速开始)
- [vue中简写](#vue中简写)
- [支持微信小程序](#支持微信小程序)

[📐 按需加载](#按需加载)
- [完整引入](#完整引入)
- [按需引入](#按需引入)

[🍕 进阶使用](#进阶使用)
- [阻止默认事件](#阻止默认事件)
- [双击](#双击)


[:bulb: API](docs/API.md)

[:lollipop: 事件对象(event)](docs/EVENT.md)

[:heavy_exclamation_mark::heavy_exclamation_mark::heavy_exclamation_mark: 注意事项](#注意事项)

## 安装

```javascript
npm i -S any-touch
```

## CDN

```html
<script src="https://unpkg.com/any-touch/dist/any-touch.umd.min.js"></script>
<script>
    console.log(AnyTouch.version); // 2.0.0
</script>
```

## 快速开始

```javascript
import AnyTouch from 'any-touch';

const el = document.getElementById('box');
const at = new AnyTouch(el);

// e包含位移/速度/方向等信息
at.on('pan', (e) => console.log(e));
```

[:rocket: 返回目录](#目录)

## vue中简写

在vue中, 可在模版元素上直接使用"@tap"语法监听手势事件. react/angular没有验证过, 但是理论上应该也支持这种简写.

```html
<template>
    <div @tap="onTap" @swipe="onSwipe" @press="onPress" @pan="onPan" @pinch="onPinch" @rotate="onRotate">
        <p>Hello any-touch</p>
    </div>
</template>

<script>
    import AnyTouch from 'any-touch';
    export default {
        mounted() {
            // 没错, 就这2行
            const at = new AnyTouch(this.$el);
            
            this.$on('hook:destroyed', () => {
                at.destroy();
            });
        },
    };
</script>
```

**注意**: **@tap**这种语法**只能**用在元素标签上, 而**不能**用在自定义组件标签上:

```html
<!-- 有效 -->
<div @tap="onTap"></div>

<!-- 不生效, 监听不到tap -->
<my-component @tap="onTap"></my-component>
```

<!-- 由于框架(vue等)的特殊行, 建议多触点手势(pinch/rotate等pointLength>1的手势)使用`match`, 如`<div @pinch="$event.match() && onPinch"></div>`, 用来保证每个触点都落在目标元素内(使用`anyTouch.target().on()`监听不需要考虑这个问题. -->

<!-- 由于`event.currentTarget`需要在事件的回调函数触发过程中才可以得到, 而vue封装了他, any-touch没法提前进行拦截,
所以在vue中多触点的手势识别的时候,如果想要确保多个触点的`target`都是`currentTarget`的子元素或自身请使用. -->

[:rocket: 返回目录](#目录)

## 支持微信小程序

由于**小程序中没有 dom 元素**的概念, 所以我们需要通过**catchEvent**方法手动接收**touch**事件的事件对象来进行识别

```xml
<view
  @touchstart="at.catchEvent"
  @touchmove="at.catchEvent"
  @touchend="at.catchEvent"
  @touchcancel="at.catchEvent">
</view>
```

```javascript
const at = new AnyTouch()
{
    onload(){
        at.on('press', onPress);
    }
}
```

[:rocket: 返回目录](#目录)

## 按需加载

**默认 any-touch 支持所有手势**, 为了**更小的体积**, 提供了按需加载.
### 完整引入

```javascript
// 只加载pan识别器(拖拽)
import AT from 'any-touch';
const at = AT(el);
at.on('tap', (e) => {});
at.on('pan', (e) => {});
// 同时监听多个事件
at.on(['swipe', 'press', 'rotate', 'pinch'], (e) => {});
```
### 按需引入
安装"any-touch"时, 对应的"@any-touch/xxx"会**自动安装**, 直接引入即可.

```javascript
// 只加载pan识别器(拖拽)
import Core from '@any-touch/core';
import Pan from '@any-touch/pan';
// Core不识别任何手势.
const at = Core(el);
// 加载pan
at.use(Pan);

at.on('pan', e=>{});
```

### @any-touch/core

手势库的核心组件, 主要用来实现 PC/移动端的兼容([查看更多](packages/core/README.md)).

### @any-touch/xx 手势识别器

**手势识别器**均已做成独立的包, 从而实现按需加载.

| 名称                  | 说明                              |
| --------------------- | --------------------------------- |
| **@any-touch/tap**    | [点击](packages/tap/README.md)    |
| **@any-touch/pan**    | [拖拽](packages/pan/README.md)    |
| **@any-touch/swipe**  | [划](packages/swipe/README.md)    |
| **@any-touch/press**  | [按压](packages/press/README.md)  |
| **@any-touch/pinch**  | [缩放](packages/pinch/README.md)  |
| **@any-touch/rotate** | [旋转](packages/rotate/README.md) |


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fa1a4dae46047d58b371e8ff1704dc8~tplv-k3u1fbpfcp-zoom-1.image)

## 手势识别器支持事件对照表

| 识别器     | 事件名                                               | 说明                          |
| ---------- | ---------------------------------------------------- | ----------------------------- |
| **tap**    | tap                                                  | 单击                          |
| **press**  | press / pressup                                      | 按压 / 松开                   |
| **pan**    | pan / panstart / panmove / panend                    | 拖拽 / 拖拽开始 / 进行 / 结束 |
| **swipe**  | swipe / swipeup / swipedown / swiperight / swipeleft | 快划 / 不同方向快划           |
| **pinch**  | pinch / pinchstart / pinchmove / pinchend            | 缩放 / 缩放开始 / 进行 / 结束 |
| **rotate** | rotate / rotatestart / rotatemove / rotateend        | 旋转 / 旋转开始 / 进行 / 结束 |

```javascript
// 拖拽中只出发一次
at.on('panstart', (e) => {
    console.log('拖拽开始');
});
```

[:rocket: 返回目录](#目录)

## 进阶使用

### 阻止默认事件
参数"preventDefault"是一个函数, 可以通过他的返回值的"true/false"来决定是否"阻止默认事件".


**比如实现**: "只有pinch/rotate才阻止默认事件"

```javascript
const at = new AnyTouch(el, {
    preventDefault(e) {
        return 1 == e.touches.length;
    },
});
```
参数"**e**"是原生事件对象, 移动端是TouchEvent, PC端是MouseEvent.

[:rocket: 返回目录](#目录)


### 双击

使用**beforeEach**拦截器, 在每个手势触发之前可以进行自定义拦截操作.

hook 是个函数, 签名: (context: PluginContext & { event: AnyTouchEvent }, next: () => void) => void

**context**: 对象,包含插件信息和事件对象的信息.

**next**: 拦截函数, 只有执行了`next()`才会触发当前识别器对应的事件.

**下面实现"双击"手势, 逻辑如下:**

1. 使用 tap 插件定义"双击"识别功能.
2. 使用"beforeEach"控制"单击 tap"事件延迟 300ms 触发.
3. 如果 300ms 内出现了"双击 doubletap"事件, 那么阻止"单击 tap"触发.
4. 这时只会有"双击 doubletap"触发.

```javascript
import Core from '@any-touch/core';
import tap from '@any-touch/tap';
import { STATUS_POSSIBLE, STATUS_FAILED } from '@any-touch/shared';
const at = Core(el);
at.use(tap, { name: 'doubletap', tapTimes: 2 });
let timeID = null;
at.beforeEach((context, next) => {
    if ('tap' === context.name) {
        clearTimeout(timeID);
        timeID = setTimeout(() => {
            const { state } = at.get('doubletap');
            const ok = [STATE_POSSIBLE, STATE_FAILED].includes(state);
            if (ok) {
                next();
            }
        }, 300);
    } else {
        next();
    }
});

at.on('tap', onTap);
at.on('doubletap', onDoubleTap);
```

**注意**: 同理可以实现"**3击**"或"**n击**".

## 注意事项

### 手势识别器的 name 字段必填

自定义手势**一定记得给起一个名字哦**, 而且不要和默认存在的手势同名(已有 tap/swipe/pan/rotate/pinch/press).

```javascript
at.use(Tap, { pointLength: 2, name: 'twoFingersTap' });
at.on('twoFingersTap', onTwoFingersTap);
```

### 不要用 alert 调试

:heavy_exclamation_mark::heavy_exclamation_mark::heavy_exclamation_mark: 在安卓手机的真机上, 如果`touchstart`或`touchmove`阶段触发了`alert`, 会出现后续的`touchmove/touchend`不触发的 bug. 所以请大家务必避免在手势的事件回调中使用`alert`.
[测试代码](https://codepen.io/russell2015/pen/vYBjVNe)

如果仅仅是了在移动端调试, 请使用腾讯的[vconsole](https://github.com/Tencent/vConsole)

### macos 上的 chrome 浏览器触发 touchend 会比较慢

由于上述原因, swipe 事件发生的会"慢半拍",所以请大家最终测试以手机效果为准.

### 移动端尽量使用 tap 代理 click

在移动端 touchstart 比 click 先触发, 所以 touchstart 阶段的 preventDefault 会阻止 click 触发, 恰恰 any-touch 默认在 touchstart 中使用了`preventDefault`, 用来阻止了浏览器默认事件的触发,比如 click 和页面滚动.

如果移动端非要使用 click 做如下设置

```javascript
const at = new AnyTouch(el, { preventDefault: false });
```

[:rocket: 返回目录](#目录)

