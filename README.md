# any-touch [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![size-image]][size-url] [![codecov](https://badgen.net/codecov/c/github/any86/any-touch/master)](https://codecov.io/gh/any86/any-touch) [![CircleCI](https://circleci.com/gh/any86/any-touch.svg?style=svg)](https://circleci.com/gh/any86/any-touch)

[size-image]: https://badgen.net/bundlephobia/minzip/any-touch
[size-url]: https://bundlephobia.com/result?p=any-touch
[npm-image]: https://badgen.net/npm/v/any-touch
[npm-url]: https://npmjs.org/package/any-touch
[downloads-image]: https://badgen.net/npm/dt/any-touch
[downloads-url]: https://npmjs.org/package/any-touch

## 注意
any-touch在0.6.0版本后有重大变化, 暂时请大家使用0.5.2
```
npm i -S any-touch@0.5.2
```

:wave: 一个基于typescript实现的手势库.
- [x] 支持更多设备: PC端 / 移动端 / [微信小程序](#支持微信小程序).
- [x] 支持手势更全面: **tap**(点击) / **press**(按) / **pan**(拖拽) / **swipe**(划) / **pinch**(捏合) / **rotate**(旋转) 6大类手势.
- [x] 更简单: 支持 [vue指令](#支持vue指令).
- [x] 更放心: 代码测试覆盖率**100%**.

## 演示

![二维码](https://user-images.githubusercontent.com/8264787/64757535-fc6da200-d564-11e9-9bf6-1ac40e08b8b7.png)

[直接访问](https://any86.github.io/any-touch/example/)

## 直达

[:zap: 快速开始](#快速开始)

[:alien: 名词解释](docs/CONCEPT.md) 

[:iphone: 支持微信小程序](#支持微信小程序)

[:seedling: 支持vue指令](#支持vue指令)

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

// vue指令插件
https://unpkg.com/any-touch/dist/any-touch.v-touch.min.js
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

## 更多手势
根据手势的运动方向和状态我们还支持panstart / panup / pinchin / pinchout / pressup等更多的手势事件.
```javascript
// 旋转中触发
at.on('roatemove', ev=>{});
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

## 支持vue指令
```javascript
import vTouch from 'any-touch/dist/v-touch.common'
Vue.use(vTouch);
```

```html
<!-- xxx.vue -->
<div
  v-touch
  @tap="tap"
  @doubletap="doubletap"
  @press="press"
  @pan="pan"
  @pinch="pinch"
  @rotate="rotate"
  @click="click"
>hello v-touch</div>
```
此时`div`上可以通过`v-on`进行手势的绑定,和绑定 click 等原生事件一样.

##### :bulb: v-touch 高级设置
我们可以通过v-touch导入AnyTouch的实例, 然后进行高级设置.
```html
<!-- xxx.vue -->
<div v-touch="importAT" @tap="tap">touch</div>
```

```javascript
export default {
  methods: {
    importAT(at) {
      const doubletap = at.get("doubletap");
      // 开启双击
      doubletap.disabled = false;
    }
  }
};
```

[示例](https://any86.github.io/any-touch/example/vue/)

## 更多应用

[基础](https://codepen.io/russell2015/pen/rRmQaw#)

[自定义手势-双击](https://codepen.io/russell2015/pen/xBrgjJ)

[全部手势展示](https://any86.github.io/any-touch/example/)

[做一个drawer(抽屉)插件](https://codepen.io/russell2015/pen/jJRbgp?editors=0010)


## 参数说明
|名称|类型|默认值|简要说明|
|---|---|---|---|
|touchAction|`String`|`'compute'`|对应css的touch-action属性|
|hasDomEvents|`Boolean`|`true`|是否派发手势名对应的原生事件|
|isPreventDefault|`Boolean`|`true`|是否阻止默认事件|
|preventDefaultExclude|`RegExp \| ((ev: SupportEvent) => boolean)`|`/^(INPUT\|TEXTAREA\|BUTTON\|SELECT)$/`|符合条件可不阻止默认事件的触发|
|syncToAttr|`Boolean`|`true`|是否在元素上的`at-gesture`属性赋值当前手势名|
|cssPrevent|`Object`|`{selectText: true,drag: true, tapHighlight: true, callout: true}`|是否开启上述禁止浏览器默认事件的css属性|

## 不要用alert调试

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
const doubletap = at.get("doubletap");
// 开启双击
doubletap.disabled = false;
```
