# any-touch [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![size-image]][size-url] [![codecov](https://badgen.net/codecov/c/github/any86/any-touch/master)](https://codecov.io/gh/any86/any-touch) [![CircleCI](https://circleci.com/gh/any86/any-touch.svg?style=svg)](https://circleci.com/gh/any86/any-touch)

[size-image]: https://badgen.net/bundlephobia/minzip/any-touch
[size-url]: https://bundlephobia.com/result?p=@any-touch/core
[npm-image]: https://badgen.net/npm/v/any-touch
[npm-url]: https://npmjs.org/package/any-touch
[downloads-image]: https://badgen.net/npm/dt/any-touch
[downloads-url]: https://npmjs.org/package/any-touch

:wave: 一个小巧的手势库.

-   [x] **更多端**: PC 端 / 移动端 / [微信小程序](#支持微信小程序).
-   [x] **更灵巧**: 默认加载6个手势, 也可按需加载手势, 核心@any-touch/core只有2kb.
-   [x] **更简单**: 通过自定义 DOM 事件和**Vue**语法完美配合, [使用更简单](#完美配合vue).
-   [x] **更放心**: 代码测试覆盖率**100%**.

## 演示
<details>
<summary>查看二维码</summary>
<img src="https://user-images.githubusercontent.com/8264787/73740124-83285300-4782-11ea-9660-fcd50183f27b.png" />
</details>

[直接访问](https://any86.github.io/any-touch)

## 直达

[:zap: 快速开始](#快速开始)
    
[🤖 按需加载](#按需加载)

[:iphone: 支持微信小程序](#支持微信小程序)

[:seedling: 完美配合 vue](#完美配合vue)

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


## 按需加载
<!-- ![](https://user-images.githubusercontent.com/8264787/73827884-4b311680-483b-11ea-9cf5-946ac77fc5f1.png) -->
可以通过单独引入"@any-touch/core"和"@any-touch/xxx手势"来实现.

**⚠️注意**: 执行`npm i any-touch`后, **@any-touch/core和@any-touch/pan**便已自动安装, 直接引入即可.

```javascript
// 只加载pan识别器(拖拽)
import Core from '@any-touch/core';
import Pan from '@any-touch/pan';
Core.use(Pan)
const at = new Core(el);
// 拖拽
at.on('pan', (ev) => {
    // ev包含位置/速度/方向等信息
});
```
### @any-touch/core
手势库的核心组件, 主要用来把Mouse/Touch输入变成统一的输出, 实现PC/Mobile端的兼容.
```javascript
import Core from '@any-touch/core';
const at = new Core(el);
// 兼容Mouse/Touch
at.on('at:touch', (ev) => {
    // ev包含位置/时间/事件对象等属性.
});
```

### @any-touch/tap等
手势识别器均已做成独立的包, 从而实现按需加载.

| 名称 | 说明 |
| --- | --- |
| **@any-touch/tap**    |[点击](packages/tap/README.md)|
| **@any-touch/pan**    |[拖拽](packages/pan/README.md)|
| **@any-touch/swipe**  |[划](packages/swipe/README.md)|
| **@any-touch/press**  |[按压](packages/press/README.md)|
| **@any-touch/pinch**  |[缩放](packages/pinch/README.md)|
| **@any-touch/rotate** |[旋转](packages/rotate/README.md)|

**注意**: 如果直接引入"any-touch", 不需要单独引入上面的包:
```javascript
// any-touch直接集成了6类手势识别器
import AnyTouch from 'any-touch';
at.on('rotate', ev => {});
```
对比"按需加载":
```javascript
import Core from '@any-touch/core';
import Rotate from '@any-touch/rotate';
// 旋转超过5度, 才触发rotate事件
Core.use(Rotate, {threshold:5});
const at = new Core(el);
at.on('rotate', ev=>{})
```

## 支持微信小程序

由于微信小程序中没有 dom 元素的概念, 所以我们需要通过`catchEvent`方法手动接收 touch 事件的事件对象来进行识别!

```xml
<view 
  @touchstart="onTouchstart"
  @touchmove="onTouchmove"
  @touchend="onTouchend"></view>
```

```javascript
const at = new AnyTouch()
{
    onload(){
        at.on('press', ev=>{
            // 按压
        });
    },

    methods: {
      onTouchstart(ev){
        at.catchEvent(ev);
      },
      onTouchmove(ev){
        at.catchEvent(ev);
      },
      onTouchend(ev){
        at.catchEvent(ev);
      }
    }
}
```

## 完美配合vue
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

## beforeEach拦截
手势的触发与否可自由控制, 比如可以实现"单击延迟300ms, 如果双击没有触发才触发":
```javascript
import AnyTouch from '@any-touch/core';
import Tap from '@any-touch/tap';
import debounce from 'lodash/debounce'
AnyTouch.use(Tap);
AnyTouch.use(Tap, { name: 'doubletap', tapTimes: 2 });
const at = new AnyTouch(el);

// 🚀关键代码
// beforeEach
at.beforeEach(({ recognizerMap, name }, next) => {
    if ('tap' === name) {
        debounce(() => {
            if (['failed', 'possible'].includes(recognizerMap.doubletap.status)) next();
        }, 300);
    } else {
        next();
    }
});

at.on('tap', onTap);
at.on('doubletap', onDoubleTap);
```
"**next**"的执行用来决定是否触发对应事件.


## 不要用 alert 调试

:heavy_exclamation_mark::heavy_exclamation_mark::heavy_exclamation_mark: 在安卓手机的真机上, 如果`touchstart`或`touchmove`阶段触发了`alert`, 会出现后续的`touchmove/touchend`不触发的 bug. 所以请大家务必避免在手势的事件回调中使用`alert`.
[测试代码](https://codepen.io/russell2015/pen/vYBjVNe)

如果仅仅是了在移动端调试, 请使用腾讯的[vconsole](https://github.com/Tencent/vConsole)