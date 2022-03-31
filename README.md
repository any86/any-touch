# any-touch [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![size-image]][size-url] [![codecov](https://codecov.io/gh/any86/any-touch/branch/master/graph/badge.svg)](https://codecov.io/gh/any86/any-touch) [![CircleCI](https://circleci.com/gh/any86/any-touch.svg?style=svg)](https://circleci.com/gh/any86/any-touch)

[size-image]: https://badgen.net/bundlephobia/minzip/@any-touch/core
[size-url]: https://bundlephobia.com/result?p=@any-touch/core
[npm-image]: https://badgen.net/npm/v/any-touch
[npm-url]: https://npmjs.org/package/any-touch
[downloads-image]: https://badgen.net/npm/dt/any-touch
[downloads-url]: https://npmjs.org/package/any-touch

![6类手势](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/102a244991064824900ac45efeb9251d~tplv-k3u1fbpfcp-zoom-1.image)

-   支持 PC 端 / 移动端 / [微信小程序](#支持微信小程序).
-   默认加载**6 个手势**, 也可[按需加载](#按需加载)手势, 核心**1kb**, 完整**5kb**.
-   **无依赖, 不限于 Vue / React / Angular 等...**

## 演示

<details>
<summary>查看二维码</summary>
<img src="https://user-images.githubusercontent.com/8264787/104836031-a55ca780-58e5-11eb-936a-7e2d1a05ee86.png" />
</details>

[简单演示](https://any86.github.io/any-touch)

[衍生产物: any-scroll(虚拟滚动)](https://github.com/any86/any-scroll)

## 目录

[:zap: 快速开始](#快速开始)

-   [纯 js 插件, 无依赖](#快速开始)
-   [vue 等框架中的简写](#vue等框架中的简写)
-   [支持微信小程序](#支持微信小程序)

[📐 按需加载](#按需加载)

-   [完整引入](#完整引入)
-   [按需引入](#按需引入)

[🌈 进阶使用](#进阶使用)

-   [阻止默认事件](#阻止默认事件)
-   [双击(🥂doubletap)](https://github.com/any86/any-touch/tree/master/packages/doubletap)
-   [typescript](#typescript)
-   ["at:xxx"统一事件](#atxxx事件)

[:bulb: API](docs/API.md)

[:lollipop: 事件对象(event)](docs/EVENT.md)

[🍳 常见问题](#常见问题)

-   [不要用 alert 调试](#不要用-alert-调试)
-   [macos 上的 chrome 浏览器触发 touchend 会比较慢](#macos-上的-chrome-浏览器触发-touchend-会比较慢)
-   [移动端尽量使用 tap 代理 click](#移动端尽量使用-tap-代理-click)
-   [使用 pnpm 提示找不到@any-touch/xxx](#使用pnpm提示找不到any-touchxxx)

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

## 快速开始

```javascript
import AnyTouch from 'any-touch';

const el = document.getElementById('box');
const at = new AnyTouch(el);

// e包含位移/速度/方向等信息
at.on('pan', (e) => console.log(e));
```

[:rocket: 返回目录](#目录)

## vue 中的简写

默认所有手势都会触发原生 DOM 事件, 所以在 vue 中可在模版元素上直接使用"@tap"等语法监听手势事件.

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
            const at = new AnyTouch(this.$el);
            //  销毁
            this.$on('hook:destroyed', () => {
                at.destroy();
            });
        },
    };
</script>
```

**注意**: vue 中 "**@tap**"这种语法**只能**用在元素标签上, 而**不能**用在自定义组件标签上:

```html
<!-- 有效 -->
<div @tap="onTap"></div>

<!-- 不生效, 监听不到tap -->
<my-component @tap="onTap"></my-component>
```

### 指令

进一步简化, 可以直接使用`@any-touch/vue3`, 是一个 vue3 指令.

```javascript
// main.js
import VTouch from '@any-touch/vue3';
const app = createApp();
app.use(VTouch);
```
现在可以在模板中使用`v-touch`指令来给当前元素增加手势识别.
``` html
// xx.vue
<template>
    <xx-component v-touch  
        @tap="onTap" @swipe="onSwipe" @press="onPress" @pan="onPan" @pinch="onPinch" @rotate="onRotate"></xx-component>
</template>
```

### 对比
1. 指令版本可以用在**元素/vue组件**上, 而原生版本只支持元素.
2. 指令版**暂不支持按需加载**, 对于库的开发者, 推荐使用原生版本.

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

`@any-touch/core`是核心包, 用来兼容 mouse/touch 输入, 具体的手势需要加载对应的识别器, 比如`@any-touch/pan`拖拽识别器.

```shell
npm i -S @any-touch/core # 核心
npm i -S @any-touch/tap  # 点击
npm i -S @any-touch/pan  # 拖拽
npm i -S @any-touch/press  # 按压
npm i -S @any-touch/swipe  # 快划
npm i -S @any-touch/pinch  # 缩放
npm i -S @any-touch/rotate  # 旋转
npm i -S @any-touch/doubletap  # 双击(通过tap扩展的特例)
```

**汇成一行:**

```shell
npm i -S @any-touch/core @any-touch/tap @any-touch/pan @any-touch/press @any-touch/swipe @any-touch/pinch @any-touch/rotate @any-touch/doubletap
```

```javascript
// 只加载pan识别器(拖拽)
import Core from '@any-touch/core';
import pan from '@any-touch/pan
// Core不识别任何手势.
const at = new Core(el);
// 加载pan
at.use(pan);

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

| 识别器     | 事件名                                                            | 说明                                                  |
| ---------- | ----------------------------------------------------------------- | ----------------------------------------------------- |
| **tap**    | tap                                                               | 单击                                                  |
| **press**  | press / pressup                                                   | 按压 / 松开                                           |
| **pan**    | pan / panstart / panmove / panend /panup/pandown/panright/panleft | 拖拽 / 拖拽开始 / 拖拽进行中 / 拖拽结束/ 上下左右滑动 |
| **swipe**  | swipe / swipeup / swipedown / swiperight / swipeleft              | 快划 / 不同方向快划                                   |
| **pinch**  | pinch / pinchstart / pinchmove / pinchend / pinchin /pinchout     | 缩放 / 缩放开始 / 缩放进行中 / 缩放结束 / 放大 / 缩小 |
| **rotate** | rotate / rotatestart / rotatemove / rotateend                     | 旋转 / 旋转开始 / 旋转进行中 / 旋转结束               |

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

**比如实现**: 阻止多点触发的事件的"默认事件", 比如"pinch/rotate".

```javascript
const at = new AnyTouch(el, {
    preventDefault(e) {
        return 1 == e.touches.length;
    },
});
```

参数"**e**"是原生事件对象, 移动端是[TouchEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent), PC 端是[MouseEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/MouseEvent).

[:rocket: 返回目录](#目录)

#### typescript

针对自定义的手势, 比如上面的"双击", 在 ts 中我们需要进行"类型扩充声明", 声明文件如下:

```typescript
// global.d.ts
import tap from '@any-touch/tap';
declare module '@any-touch/core' {
    // 扩充at.get('doubletap')返回值的类型
    // 如不扩充, get返回的插件实例类型不完整.
    export interface PluginContextMap {
        doubletap: ReturnType<typeof tap>;
    }

    // 扩充at.on('doubletap',e=>{})中的e的类型
    export interface EventMap {
        doubletap: AnyTouchEvent;
    }
}
```

当然不写声明文件也可以, **偷懒的方法是**:

```typescript
// ⭐让"e"和tap事件的e的类型一致,
// 毕竟都是tap识别器衍生的事件
at.on('doubletap' as 'tap', (e) => {});

// ⭐返回tap识别器的实例,
// 其实就是同一个识别器的实例
at.get('doubletap' as 'tap');
```

**注意**: 上面 2 种写法都 ok, 在这里写声明文件和断言其实没区别, 都可以正确的推导出其他部分的类型.
[:rocket: 返回目录](#目录)

#### "at:xxx"事件

宽泛的事件钩子.

| 名称         | 说明                        |
| ------------ | --------------------------- |
| at:start     | 开始触碰/触点增加触发       |
| at:move      | 触点移动触发                |
| at:end       | 触点离开触发                |
| **at:after** | 任意事件触发后,其都会被触发 |

"at:after"的事件对象和其他事件的不同, 多一个 name 字段, 这个 name 表示哪个事件引起的"at:after".

```typescript
at.on('at:after', (e) => {
    // ⭐tap/pan/swipe/press/pinch/rotate/at:start/at:move/at:end
    console.log(e.name);
});
```

[:rocket: 返回目录](#目录)

## 常见问题

### 手势识别器的 name 字段必填

自定义手势**一定记得给起一个名字哦**, 而且不要和默认存在的手势同名(已有 tap/swipe/pan/rotate/pinch/press).

```javascript
at.use(tap, { pointLength: 2, name: 'twoFingersTap' });
at.on('twoFingersTap', onTwoFingersTap);
```

[:rocket: 返回目录](#目录)

### 不要用 alert 调试

:heavy_exclamation_mark::heavy_exclamation_mark::heavy_exclamation_mark: 在安卓手机的真机上, 如果`touchstart`或`touchmove`阶段触发了`alert`, 会出现后续的`touchmove/touchend`不触发的 bug. 所以请大家务必避免在手势的事件回调中使用`alert`.
[测试代码](https://codepen.io/russell2015/pen/vYBjVNe)

如果仅仅是了在移动端调试, 请使用腾讯的[vconsole](https://github.com/Tencent/vConsole)

[:rocket: 返回目录](#目录)

### macos 上的 chrome 浏览器触发 touchend 会比较慢

由于上述原因, swipe 事件发生的会"慢半拍",所以请大家最终测试以手机效果为准.

[:rocket: 返回目录](#目录)

### 移动端尽量使用 tap 代理 click

在移动端 touchstart 比 click 先触发, 所以 touchstart 阶段的 preventDefault 会阻止 click 触发, 恰恰 any-touch 默认在 touchstart 中使用了`preventDefault`, 用来阻止了浏览器默认事件的触发,比如 click 和页面滚动.

如果移动端非要使用 click 做如下设置

```javascript
const at = new AnyTouch(el, { preventDefault: false });
```

[:rocket: 返回目录](#目录)

### 使用 pnpm 提示找不到@any-touch/xxx

这是因为**pnpm 不像 yarn 和 npm, 其不会把 any-touch 依赖的包安装到 node_modules 目录的根**, 所以会提示找不到. [参考 pnpm 说明](https://pnpm.io/zh/faq#%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%881).

如果使用 pnpm, 那么只能通过手动安装包解决.

```shell
pnpm i @any-touch/core @any-touch/tap @any-touch/press @any-touch/pan @any-touch/swipe @any-touch/pinch @any-touch/rotate
```

### 使用了 AnyTouch 后页面不能滑动了?

因为 AnyTouch 默认开启了"preventDefault:true", 你可以设置他为"false", 但是如果交互情况比较复杂未能满足, 你可以参考[阻止默认事件](#阻止默认事件)

[:rocket: 返回目录](#目录)
