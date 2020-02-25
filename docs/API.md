# :bulb: API

## 目录

[constructor(初始化)](#constructor)

[on(监听)](#on)

[target(事件委派)](#targetZ)

[set(设置)](#set)

[use(加载手势)](#use)

[removeUse(移除手势)](#removeUse)

[catchEvent(注入事件对象)](#catchEvent)

[beforeEach(拦截器)](#beforeEach)

[get(获取手势)](#get)

[destroy(销毁)](#destroy)

[AnyTouch.识别器](#AnyTouch识别器)

[AnyTouch.状态码](#AnyTouch状态码)

## constructor

**constructor([el], [options])**

初始化设置, 微信小程序下由于没有 DOM 元素, 可以无 el 初始化, 然后通过[catchEvent](#catcheventevent)函数接收 touch 事件.

```javascript
// 初始化
const el = doucument.getElementById('box');
const at = new AnyTouch(el, {
    isPreventDefault: false,
    domEvents: false,
    // 如果触发事件的是span元素, 那么不执行"阻止默认事件触发".
    preventDefaultExclude: (ev) => 'SPAN' === ev.target.tagName
});
```

#### options

| 名称                  | 类型                 | 默认值                                  | 简要说明                                  |
| --------------------- | -------------------- | --------------------------------------- | ----------------------------------------- |
| isPreventDefault      | `Boolean`            | `true`                                  | 阻止默认事件触发, 比如:页面滚动/click 等. |
| domEvents             | `Boolean`            | `true`                                  | 是否派发手势名对应的原生事件.             |
| preventDefaultExclude | `RegExp \| Function` | `/^(INPUT\|TEXTAREA\|BUTTON\|SELECT)$/` | 符合条件可跳过"阻止默认事件".             |

#### 使用addEventListener监听手势事件
如果**domEvents**为true, 可以使用原生**addEventListener**监听手势事件:
```javascript
// 默认domEvents等于true
const at = new AnyTouch(el);
el.addEventListener('tap', onTap);
```

所以同理, vue中也可以在模板直接绑定事件:
```html
<div @tap="onTap"></div>
```

[返回目录](#目录)

## on

**on(eventName, listener, [options])**

事件监听.

```javascript
at.on('tap', (ev) => {
    console.log(ev.type);
    // 输出: 'tap'
});
```

#### options

| 名称   | 类型          | 默认值 | 简要说明                                                             |
| ------ | ------------- | ------ | -------------------------------------------------------------------- |
| target | `HTMLElement` | -      | 使用事件委派模式, 表示只有指定子元素(相对构造函数中的 el)才响应事件. |

```javascript
const child = at.el.children[0];
at.on('pan', onPan, { target: child });
```

[:lollipop: 更多事件对象(event)](EVENT.md)

[返回目录](#目录)

## target

**target(el):Function**

事件委派的简化写法.

```javascript
at.on('pan', onPan, { target: child });
// 还可以表示为
at.target(child).on('pan', onPan);
```

[返回目录](#目录)

## set

**set(options)**

改变设置

```javascript
at.set({ isPreventDefault: true });
```

[返回目录](#目录)

## use

**use(Recognizer, options)**

加载手势识别器, options 为手势识别器的参数.

```javascript
at.use(AnyTouch.Tap, { tapTime: 2, name: 'doubletap' });
// 也可在初始化之前加载
AnyTouch.use(AnyTouch.Tap, { tapTime: 2, name: 'doubletap' });
```

[返回目录](#目录)

## removeUse

**removeUse([recognizerName])**

删除识别器, 如果不传参数, 代表清空所有已加载手势.

```javascript
at.removeUse('doubletap');
// 也可在初始化之前清空默认已加载识别器
AnyTouch.removeUse();
```

[返回目录](#目录)

## catchEvent

**catchEvent(event)**

仅仅微信小程序下需要使用, 因为微信小程序没有 dom 元素的概念, 所以需要**手动接收 touch 事件对象**.

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

[返回目录](#目录)

## beforeEach

**beforeEach(hook)**

拦截器, 在每个手势触发之前可以进行自定义拦截操作.
hook: (recognizer: Recognizer, next: () => void) => void
**recognizer**: 手势识别器.
**next**: 拦截函数, 只有执行了`next()`才会触发当前识别器对应的事件.

举例实现"单击延迟 300ms, 如果双击没有触发才触发(默认手势事件都是并行触发)":

```javascript
import AnyTouch from '@any-touch/core';
import Tap from '@any-touch/tap';
// 如果引入的是完整版, 那么STATUS_POSSIBLE等可以直接通过AnyTouch.STATUS_POSSIBLE获取
import { STATUS_POSSIBLE, STATUS_FAILED } from '@any-touch/shared';
import debounce from 'lodash/debounce';
AnyTouch.use(Tap);
AnyTouch.use(Tap, { name: 'doubletap', tapTimes: 2 });
const at = new AnyTouch(el);

// 🚀关键代码
// beforeEach
at.beforeEach(({ recognizerMap, name }, next) => {
    if ('tap' === name) {
        debounce(() => {
            if ([STATUS_POSSIBLE, STATUS_FAILED].includes(recognizerMap.doubletap.status)) next();
        }, 300);
    } else {
        next();
    }
});

at.on('tap', onTap);
at.on('doubletap', onDoubleTap);
```

[返回目录](#目录)

## get

**get(name: string): Recognizer | void**

通过名字获取指定识别器.

```javascript
const tap = at.get('tap');
if (void 0 !== tap) {
    tap.set({ disabled: true });
}
```

[返回目录](#目录)

## destroy

销毁实例.

```javascript
at.destroy();
```

[返回目录](#目录)

## AnyTouch.识别器

手势识别器.

如果是引入的完整版 any-touch, 那么可以通过 AnyTouch 获取到 6 个手势识别器:"**Tap(点击) / Pan(拖拽) / Swipe(快划) / Press(按压) / Pinch(缩放) / Rotate(旋转)**".

```javascript
import AnyTouch from 'any-touch`;
const {Tap, Pan,Swipe,Press,Pinch,Rotate} = AnyTouch;
```

**此外**, 手势识别器均已做成独立的包, 从也可按需加载.
| 名称 | 说明 |
| - | - |
| **@any-touch/tap** |[点击](../packages/tap/README.md)|
| **@any-touch/pan** |[拖拽](../packages/pan/README.md)|
| **@any-touch/swipe** |[划](../packages/swipe/README.md)|
| **@any-touch/press** |[按压](../packages/press/README.md)|
| **@any-touch/pinch** |[缩放](../packages/pinch/README.md)|
| **@any-touch/rotate** |[旋转](../packages/rotate/README.md)|

[返回目录](#目录)

## AnyTouch.状态码

识别器状态,共有 6 种状态.

```javascript
import AnyTouch from 'any-touch`;
const {STATUS_POSSIBLE, STATUS_RECOGNIZED} = AnyTouch;
```

| 变量              | 说明                                                                         |
| ----------------- | ---------------------------------------------------------------------------- |
| STATUS_POSSIBLE   | 表示当前还"未识别"                                                           |
| STATUS_START      | "**拖拽类**"手势(pan/pinch/rotate 等)中表示"第一次识别."                     |
| STATUS_MOVE       | "拖拽类"手势中表示"识别后移动中"                                             |
| STATUS_END        | "拖拽类"手势中表示"有触点离开,即手势结束"                                    |
| STATUS_CANCELLED  | 手势识别后,发生事件中断,比如"来电话","浏览器最小化"等.                       |
| STATUS_FAILED     | 表示"识别失败", 比如识别 tap 的时候,触点在 250ms 内没有离开屏幕等            |
| STATUS_RECOGNIZED | 表示"已识别", 区别于"拖拽类"手势, 用在"瞬发"识别的手势,比如 tap/press/swipe. |

一般用来配合[beforeEach](#beforeeachhook)实现一些自定义功能.

[返回目录](#目录)
