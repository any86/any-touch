# any-touch [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![size-image]][size-url] [![codecov](https://codecov.io/gh/any86/any-touch/branch/master/graph/badge.svg)](https://codecov.io/gh/any86/any-touch) [![CircleCI](https://circleci.com/gh/any86/any-touch.svg?style=svg)](https://circleci.com/gh/any86/any-touch)

[size-image]: https://badgen.net/bundlephobia/minzip/any-touch
[size-url]: https://bundlephobia.com/result?p=@any-touch/core
[npm-image]: https://badgen.net/npm/v/any-touch
[npm-url]: https://npmjs.org/package/any-touch
[downloads-image]: https://badgen.net/npm/dt/any-touch
[downloads-url]: https://npmjs.org/package/any-touch

:wave: 一个小巧的手势库.

- [x] **更多端**: PC 端 / 移动端 / [微信小程序](#支持微信小程序).
- [x] **更全面**: 支持Tap(点击) / Press(按压) / Pan(拖拽) / Swipe(快划) / Pinch(缩放) / Rotate(旋转)6种手势. 
- [x] **更灵巧**: 默认加载6个手势, 也可🤖[按需加载](#按需加载)手势, 核心@any-touch/core只有**2kb**, 完整安装也仅需要**5kb**.
- [x] **更简单**: [在Vue可直接通过v-on调用](#兼容vue语法), 比如`<div @pan="onPan"></div>`.
- [x] **更放心**: 代码测试覆盖率**100%**.

## 演示
<details>
<summary>查看二维码</summary>
<img src="https://user-images.githubusercontent.com/8264787/73740124-83285300-4782-11ea-9660-fcd50183f27b.png" />
</details>

[直接访问](https://any86.github.io/any-touch)

## 目录

[:zap: 快速开始](#快速开始)

[:seedling: 兼容vue语法](#兼容vue语法)
    
[:iphone: 支持微信小程序](#支持微信小程序)

[🤖 按需加载](#按需加载)

[:bulb: API & 高级技巧](docs/API.md)

[:lollipop: 事件对象(event)](docs/EVENT.md)

[:heavy_exclamation_mark::heavy_exclamation_mark::heavy_exclamation_mark: 注意事项](#注意事项)

## 安装
```javascript
npm i -S any-touch
```

## CDN

```
https://unpkg.com/any-touch/dist/any-touch.umd.min.js
```

## 快速开始

```javascript
import AnyTouch from 'any-touch';
const el = doucument.getElementById('box');
const at = new AnyTouch(el);
// 单击
at.on('tap', e => {
    // e包含位置/速度/方向等信息
});
```
[:rocket: 返回目录](#目录)

## 兼容vue语法

```html
<div 
    @tap="onTap" 
    @swipe="onSwipe" 
    @press="onPress" 
    @pan="onPan" 
    @pinch="onPinch" 
    @rotate="onRotate">
    <p>Hello any-touch</p>
</div>
```

```javascript
import AnyTouch from 'any-touch';
export default {
    mounted() {
        // 没错, 就这2行
        const at= new AnyTouch(this.$el);
        this.on('hook:destroyed', ()=>{at.destroy()});
    }
};
```
**⚠️注意**: **@tap**这种语法**只能**用在元素标签上, 而**不能**用在自定义组件标签上:
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
[:rocket: 返回目录](#目录)




## 按需加载
**默认any-touch支持所有手势**, 为了减小"体积"和"不必要的识别器执行时间", 提供了按需加载.

![](https://user-images.githubusercontent.com/8264787/73827884-4b311680-483b-11ea-9cf5-946ac77fc5f1.png)

### 使用"按需加载"

**⚠️ 注意**: 执行`npm i any-touch`后, "@any-touch/core"和"@any-touch/xx手势"**🤖便已自动安装**, 直接引入即可.

```javascript
// 只加载pan识别器(拖拽)
import Core from '@any-touch/core';
import Pan from '@any-touch/pan';
// 使用Pan
Core.use(Pan);
const at = new Core(el);
// 拖拽
at.on('pan', (ev) => {
    // ev包含位置/速度/方向等信息
});
```
### @any-touch/core
手势库的核心组件, 主要用来把Mouse/Touch输入变成统一的输出, 实现PC/Mobile端的兼容, 提供了"**at:**"开头的兼容事件.
```javascript
import Core from '@any-touch/core';
const at = new Core(el);
// 兼容Mouse/Touch
at.on('at:touch', (ev) => {
    // ev包含位置/时间/事件对象等属性.
});
// touchstart 或 mousedown
at.on('at:touchstart', onStart);
// touchmove 或 mousemove
at.on('at:touchmove', onMove);
// touchend 或 mouseup
at.on('at:touchend', onEnd);
// touchcancel
at.on('at:touchcancel', onCancel);
```
<!-- [更多](core) -->


### @any-touch/xx手势
手势识别器均已做成独立的包, 从而实现按需加载.

| 名称 | 说明 |
| - | - |
| **@any-touch/tap**    |[点击](packages/tap/README.md)|
| **@any-touch/pan**    |[拖拽](packages/pan/README.md)|
| **@any-touch/swipe**  |[划](packages/swipe/README.md)|
| **@any-touch/press**  |[按压](packages/press/README.md)|
| **@any-touch/pinch**  |[缩放](packages/pinch/README.md)|
| **@any-touch/rotate** |[旋转](packages/rotate/README.md)|

**⚠️ 再次提示**: 如果已安装"any-touch", 上面的包便也已经自动安装.


[:rocket: 返回目录](#目录)

## 注意事项

### 手势识别器的name字段必填

自定义手势**一定记得给起一个名字哦**, 而且不要和默认存在的手势同名(已有tap/swipe/pan/rotate/pinch/press).
```javascript
AnyTouch.use(Tap, { pointLength: 2 , name:'twoFingersTap'});
at.on('twoFingersTap', onTwoFingersTap);
```

### 不要用 alert 调试

:heavy_exclamation_mark::heavy_exclamation_mark::heavy_exclamation_mark: 在安卓手机的真机上, 如果`touchstart`或`touchmove`阶段触发了`alert`, 会出现后续的`touchmove/touchend`不触发的 bug. 所以请大家务必避免在手势的事件回调中使用`alert`.
[测试代码](https://codepen.io/russell2015/pen/vYBjVNe)

如果仅仅是了在移动端调试, 请使用腾讯的[vconsole](https://github.com/Tencent/vConsole)

### macos上的chrome浏览器触发touchend会比较慢
由于上述原因, swipe事件发生的会"慢半拍",所以请大家最终测试以手机效果为准.

[:rocket: 返回目录](#目录)
