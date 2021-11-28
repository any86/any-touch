# :bulb: API

## 目录

[:fire: 初始化](#anytouchel-options)

[on(监听)](#oneventname-listener)

[set(设置)](#setoptions)

[use(加载手势)](#userecognizer-options)

[catchEvent(注入事件对象)](#catcheventevent)

[⭐beforeEach(拦截器)](#beforeeachhook)

[get(获取手势)](#getname-string-recognizer--void)

[destroy(销毁)](#destroy)

[AnyTouch.识别器](#AnyTouch识别器)

[AnyTouch.状态码](#AnyTouch状态码)

## AnyTouch([el], [options])

初始化any-touch

#### el

目标元素,微信小程序下由于没有 DOM 元素, **可以无 el 初始化**, 然后通过[catchEvent](#catcheventevent)函数接收 touch 事件.

```javascript
// 初始化
const el = doucument.getElementById('box');
const at = AnyTouch(el);
```

#### options

配置项, 是个对象.

-   **preventDefault**
    值为Boolean或Function, 函数返回值为Boolean类型, 默认值是函数:
    ```javascript
    const preventDefault = (event) => {
        if (event.target && 'tagName' in event.target) {
            const { tagName } = event.target;
            return !/^(?:INPUT|TEXTAREA|BUTTON|SELECT)$/.test(tagName);
        }
        return false;
    },
    ```
    默认只对非表单元素进行"阻止默认事件触发".

-   **domEvents**
    值为Object或false.
    **如果是false**, 那么不触发tap/pan等手势的DOM事件, 注意没有true. 
    
    **如果是Object**, 那么可以配置元素上定义的手势是否可以"取消"和"冒泡", 详细参数同[eventInit类型](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/Event), 默认情况下**可取消 / 可冒泡**,也就是`{bubbles:true,cancelable:true}`
    ```javascript
    const at = AnyTouch(el);
    el.addEventListener('tap', onTap);
    ```

    由于Vue等框架的模板中都是支持原生事件的,所以vue中可以在模板直接绑定事件:

    ```html
    <template>
        <div @tap="onTap"></div>
    </template>
    <script>
    import AnyTouch from 'any-touch';
    export default {
        mounted() {
            const at = new AnyTouch(this.$el);
        },
    };
    </script>
    ```

[:rocket: 返回目录](#目录)

## on(eventName, listener)

事件监听.

#### eventName

事件名,

```javascript
at.on('tap', onTap);
```

可以同时监听多个事件.

```javascript
at.on(['tap', 'pan'], onTouch);
```

#### listener

事件触发函数.
```javascript
const listener = event=>{
    // event是手势事件对象, 可以获取位置等信息
}
at.on('pan',listener);
```

[:lollipop: 事件对象(event)](EVENT.md)

[:rocket: 返回目录](#目录)



## set(options)

改变设置.

```javascript
//  如果当前元素是a元素, 那么阻止默认事件触发, 比如链接跳转.
at.set({ preventDefault: event=>event.target.tagName ==='A' });
```

**手势参数说明**
| 名称 | 说明 |
| - | - |
| **@any-touch/tap** |[点击](../packages/tap/README.md)|
| **@any-touch/pan** |[拖拽](../packages/pan/README.md)|
| **@any-touch/swipe** |[划](../packages/swipe/README.md)|
| **@any-touch/press** |[按压](../packages/press/README.md)|
| **@any-touch/pinch** |[缩放](../packages/pinch/README.md)|
| **@any-touch/rotate** |[旋转](../packages/rotate/README.md)|

[:rocket: 返回目录](#目录)

## use(Recognizer, options)

加载手势识别器, options 为手势识别器的参数.

```javascript
import tap from '@any-touch/tap';
at.use(tap, { tapTime: 2, name: 'doubletap' });
```

[:rocket: 返回目录](#目录)

## catchEvent(event)

仅仅微信小程序下需要使用, 因为微信小程序没有 dom 元素的概念, 所以需要**手动接收 touch 事件对象**.

```xml
<view
  @touchstart="onTouchstart"
  @touchmove="onTouchmove"
  @touchend="onTouchend"></view>
```

```javascript
const at = AnyTouch()
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

## beforeEach(hook)

拦截器, 在每个手势触发之前可以进行自定义拦截操作.

hook是个函数, 签名: (context: PluginContext & { event: AnyTouchEvent }, next: () => void) => void

**context**: 对象,包含插件信息和事件对象的信息.

**next**: 拦截函数, 只有执行了`next()`才会触发当前识别器对应的事件.

**下面实现"双击"手势, 逻辑如下:**
1. 使用tap插件定义"双击"识别功能.
2. 使用"beforeEach"控制"单击tap"事件延迟300ms触发.
3. 如果300ms内出现了"双击doubletap"事件, 那么阻止"单击tap"触发.
4. 这时只会有"双击doubletap"触发.

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

[:rocket: 返回目录](#目录)

## get(name: string): Recognizer | void

通过名字获取指定识别器.

```javascript
const tap = at.get('tap');
if (void 0 !== tap) {
    tap.set({ disabled: true });
}
```

[:rocket: 返回目录](#目录)

## destroy()

销毁实例.

```javascript
at.destroy();
```

[:rocket: 返回目录](#目录)

## AnyTouch.识别器

手势识别器.

如果是引入的完整版 **any-touch**, 那么可以通过 **AnyTouch** 获取到 **6** 个手势识别器:

```javascript
import AnyTouch from 'any-touch`;
const {tap, pan,swipe,press,pinch,rotate} = AnyTouch;
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

[:rocket: 返回目录](#目录)

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

一般用来配合[beforeEach](#beforeeachhook)控制手势触发.

[:rocket: 返回目录](#目录)
