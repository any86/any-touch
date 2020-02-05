# any-touch [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![size-image]][size-url] [![codecov](https://badgen.net/codecov/c/github/any86/any-touch/master)](https://codecov.io/gh/any86/any-touch) [![CircleCI](https://circleci.com/gh/any86/any-touch.svg?style=svg)](https://circleci.com/gh/any86/any-touch)

[size-image]: https://badgen.net/bundlephobia/minzip/any-touch
[size-url]: https://bundlephobia.com/result?p=@any-touch/core
[npm-image]: https://badgen.net/npm/v/any-touch
[npm-url]: https://npmjs.org/package/any-touch
[downloads-image]: https://badgen.net/npm/dt/any-touch
[downloads-url]: https://npmjs.org/package/any-touch

:wave: 一个小巧的手势库.

-   [x] 支持更多设备: PC 端 / 移动端 / [微信小程序](#支持微信小程序).
-   [x] 灵活可配: 按需加载需要的识别器.

<!-- ![](https://user-images.githubusercontent.com/8264787/73827884-4b311680-483b-11ea-9cf5-946ac77fc5f1.png) -->

| 名称                  | 尺寸                                                          | 说明                        |
| --------------------- | ------------------------------------------------------------- | --------------------------- |
| **@any-touch/core**   | ![](https://badgen.net/bundlephobia/minzip/@any-touch/core)   | 核心, 适配 Mouse/Touch 设备 |
| **@any-touch/tap**    | ![](https://badgen.net/bundlephobia/minzip/@any-touch/tap)    | "点击"识别器                |
| **@any-touch/pan**    | ![](https://badgen.net/bundlephobia/minzip/@any-touch/pan)    | "拖拽"识别器                |
| **@any-touch/swipe**  | ![](https://badgen.net/bundlephobia/minzip/@any-touch/swipe)  | "划"识别器                  |
| **@any-touch/press**  | ![](https://badgen.net/bundlephobia/minzip/@any-touch/press)  | "按压"识别器                |
| **@any-touch/pinch**  | ![](https://badgen.net/bundlephobia/minzip/@any-touch/pinch)  | "缩放"识别器                |
| **@any-touch/rotate** | ![](https://badgen.net/bundlephobia/minzip/@any-touch/rotate) | "旋转"识别器                |

-   [x] 更简单: 通过自定义 DOM 事件和**Vue**语法完美配合, 使用更简单.
-   [x] 更放心: 代码测试覆盖率**100%**.

## 演示

![二维码](https://user-images.githubusercontent.com/8264787/73740124-83285300-4782-11ea-9660-fcd50183f27b.png)

[直接访问](https://any86.github.io/any-touch)

## 直达

[:zap: 快速开始](#快速开始)

[:alien: 名词解释](docs/CONCEPT.md)

[:iphone: 支持微信小程序](#支持微信小程序)

[:seedling: 完美配合 vue](#完美配合vue)

[:rocket: 更多应用](#更多应用)

[:bulb: API](docs/API.md)

[:lollipop: 事件对象(event)](docs/EVENT.md)

[:heavy_exclamation_mark::heavy_exclamation_mark::heavy_exclamation_mark: 不要用 alert 调试](#不要用alert调试)

## 安装

```javascript
npm i -S any-touch
```

## CDN

```
https://unpkg.com/any-touch/dist/any-touch.min.js
```

## 快速开始

```javascript
import AnyTouch from 'any-touch';
const el = doucument.getElementById('box');
const at = new AnyTouch(el);
// 单击
at.on('tap', (ev) => {
    // ev包含位置/速度/方向等信息
});
```

## 更多手势

根据手势的运动方向和状态我们还支持 panstart / panup / pinchin / pinchout / pressup 等更多的手势事件.

```javascript
// 旋转中触发
at.on('roatemove', (ev) => {});
```

[更多手势说明](/docs/GESTURE.md)

## 支持微信小程序

由于微信小程序中没有 dom 元素的概念, 所以我们需要通过`catchEvent`方法手动接收 touch 事件的事件对象来进行识别!

```xml
<view @touchstart="touchstartHandler" @touchmove="touchmoveHandler" @touchend="touchendHandler"></view>
```

```javascript
const at = new AnyTouch()
{
    onload(){
        at.on('pinch', ev=>{
            // 缩放
        });
    },

    methods: {
      touchstartHandler(ev){
        at.catchEvent(ev);
      },
      touchmoveHandler(ev){
        at.catchEvent(ev);
      },
      touchendHandler(ev){
        at.catchEvent(ev);
      }
    }
}
```

## :bulb: 完美配合 vue

```javascript
import AnyTouch from 'any-touch';
export default {
    mounted() {
        new AnyTouch(this.$el);
    }
};
```

```html
<div @tap="tap" @doubletap="doubletap" @press="press" @pan="pan" @pinch="pinch" @rotate="rotate" @click="click">
    <p>hello any-touch</p>
</div>
```

any-touch 会模拟原生 dom 事件触发, 所以在 vue 上可以**通过 v-on 直接绑定手势**.

## 应用

[做一个 drawer(抽屉)插件](https://codepen.io/russell2015/pen/jJRbgp?editors=0010)

## 参数说明

| 名称| 类型| 默认值 | 简要说明                                     |
| --- | --- | --- |--- |
| domEvents | `Boolean`                                   | `true`                                                             | 是否派发手势名对应的原生事件                 |
| isPreventDefault      | `Boolean`                                   | `true`                                                             | 是否阻止默认事件                             |
| preventDefaultExclude | `RegExp \| ((ev: SupportEvent) => boolean)` | `/^(INPUT\|TEXTAREA\|BUTTON\|SELECT)$/`                            | 符合条件可不阻止默认事件的触发               |


## 不要用 alert 调试

:heavy_exclamation_mark::heavy_exclamation_mark::heavy_exclamation_mark: 在安卓手机的真机上, 如果`touchstart`或`touchmove`阶段触发了`alert`, 会出现后续的`touchmove/touchend`不触发的 bug. 所以请大家务必避免在手势的事件回调中使用`alert`.
[测试代码](https://codepen.io/russell2015/pen/vYBjVNe)

如果仅仅是了在移动端调试, 请使用腾讯的[vconsole](https://github.com/Tencent/vConsole)

## 常见问题

### 为什么"双击"默认是关闭的?

因为"双击"的识别需要让"单击"等待他的"第二下单击", 如果没有"第二下单击", 那么"单击"触发, 否则识别为"双击".

基于上面的逻辑, 如果默认开启了"双击", 那么没有"双击"需求的人用的时候就会觉得"单击"反应慢(因为再等双击), 出于对"大多数人没有双击需求"的考虑, 默认"双击"是关闭状态.

开启方式:

```javascript
const at = new AnyTouch(el);
const doubletap = at.get('doubletap');
// 开启双击
doubletap.disabled = false;
```
