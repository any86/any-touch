# :bulb: API

## content

[:fire:initialize](#anytouchel-options)

[on(listen)](#oneventname-listener)

[off (cancel listener)](#oneventname-listener)


[set(set)](#setoptions)

[use(load gesture)](#userecognizer-options)

[catchEvent (injected event object)](#catcheventevent)

[⭐beforeEach(interceptor)](#beforeeachhook)

[get(get gesture)](#getname-string-recognizer--void)

[destroy(destroy)](#destroy)

[AnyTouch.identifier] (#AnyTouchidentifier)

[AnyTouch.status code](#AnyTouch status code)
## AnyTouch([el], [options])

initialize any-touch

#### el

The target element, because there is no DOM element in the WeChat applet, **can be initialized without el**, and then receive the touch event through the [catchEvent](#catcheventevent) function.

````javascript
// initialize
const el = doucument.getElementById('box');
const at = AnyTouch(el);
````

#### options

A configuration item is an object.

- **preventDefault**
    The value is Boolean or Function, the return value of the function is of type Boolean, and the default value is a function:
    ````javascript
    const preventDefault = (event) => {
        if (event.target && 'tagName' in event.target) {
            const { tagName } = event.target;
            return !/^(?:INPUT|TEXTAREA|BUTTON|SELECT)$/.test(tagName);
        }
        return false;
    },
    ````
    By default only "prevent default event firing" for non-form elements.

- **domEvents**
    Value is Object or false.
    **If it is false**, then the DOM events of gestures such as tap/pan will not be triggered. Note that there is no true.
    
    **If it is Object**, then you can configure whether the gesture defined on the element can be "cancelled" and "bubble", the detailed parameters are the same as [eventInit type](https://developer.mozilla.org/zh-CN/docs /Web/API/Event/Event), by default **cancellable/bubbable**, which is `{bubbles:true,cancelable:true}`
    ````javascript
    const at = AnyTouch(el);
    el.addEventListener('tap', onTap);
    ````

    Since the templates of frameworks such as Vue support native events, events can be bound directly in the template in vue:

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
    ````

[:rocket: return to directory](#directory)

## on(eventName, listener)

Event listener.

#### eventName

event name

````javascript
at.on('tap', onTap);
````

You can listen to multiple events at the same time.

````javascript
at.on(['tap', 'pan'], onTouch);
````

#### listener

Event trigger function.
````javascript
const listener = event=>{
    // event is a gesture event object, which can get information such as position
}
at.on('pan',listener);
````

[:lollipop:event object (event)](EVENT.md)

[:rocket: return to directory](#directory)


## off(eventName, [listener])

Cancel the event listener.

#### eventName

event name

````javascript
at.off('tap', onTap);
````

Cancels all monitoring of the specified event name

````javascript
at.off('tap');
````

[:lollipop:event object (event)](EVENT.md)

[:rocket: return to directory](#directory)



## set(options)

Change settings.

````javascript
// If the current element is the a element, prevent default events from firing, such as link jumps.
at.set({ preventDefault: event=>event.target.tagName ==='A' });
````

**Gesture parameter description**
| Name | Description |
| - | - |
| **@any-touch/tap** |[click](../packages/tap/README.md)|
| **@any-touch/pan** |[drag](../packages/pan/README.md)|
| **@any-touch/swipe** |[swipe](../packages/swipe/README.md)|
| **@any-touch/press** |[press](../packages/press/README.md)|
| **@any-touch/pinch** |[zoom](../packages/pinch/README.md)|
| **@any-touch/rotate** |[rotate](../packages/rotate/README.md)|

[:rocket: return to directory](#directory)

## use(Recognizer, options)

Load the gesture recognizer, options is the parameter of the gesture recognizer.

````javascript
import tap from '@any-touch/tap';
at.use(tap, { tapTime: 2, name: 'doubletap' });
````

[:rocket: return to directory](#directory)

## catchEvent(event)

It only needs to be used under the WeChat applet, because the WeChat applet does not have the concept of dom element, so it needs to **manually receive the touch event object**.

````xml
<view
  @touchstart="onTouchstart"
  @touchmove="onTouchmove"
  @touchend="onTouchend"></view>
````

````javascript
const at = AnyTouch()
{
    onload(){
        at.on('press', ev=>{
            // press
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
````
[:rocket: return to directory](#directory)

## beforeEach(hook)

Interceptor, which can perform custom interception operations before each gesture is triggered.

hook is a function, signature: (context: PluginContext & { event: AnyTouchEvent }, next: () => void) => void

**context**: Object, containing plugin information and event object information.

**next**: The interception function, only when `next()` is executed will the event corresponding to the current recognizer be triggered.

**The following implements the "double-click" gesture, the logic is as follows:**
1. Use the tap plugin to define the "double click" recognition function.
2. Use "beforeEach" to control the "click tap" event to fire with a delay of 300ms.
3. If there is a "double tap doubletap" event within 300ms, then prevent "single tap" from triggering.
4. At this time, only "double tap doubletap" will be triggered.

````javascript
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
            const { state } = at. get('doubletap');
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
````

[:rocket: return to directory](#directory)

## get(name: string): Recognizer | void

Get the specified identifier by name.

````javascript
const tap = at.get('tap');
if (void 0 !== tap) {
    tap.set({ disabled: true });
}
````

[:rocket: return to directory](#directory)

## destroy()

Destroy the instance.

````javascript
at.destroy();
````

[:rocket: return to directory](#directory)

## AnyTouch. Recognizer

Gesture recognizer.

If the full version of **any-touch** is introduced, then **6** gesture recognizers can be obtained through **AnyTouch**:

````javascript
import AnyTouch from 'any-touch`;
const {tap, pan, swipe, press, pinch, rotate} = AnyTouch;
````

**Further**, gesture recognizers have been made into separate packages, which can also be loaded on demand.
| Name | Description |
| - | - |
| **@any-touch/tap** |[click](../packages/tap/README.md)|
| **@any-touch/pan** |[drag](../packages/pan/README.md)|
| **@any-touch/swipe** |[swipe](../packages/swipe/README.md)|
| **@any-touch/press** |[press](../packages/press/README.md)|
| **@any-touch/pinch** |[zoom](../packages/pinch/README.md)|
| **@any-touch/rotate** |[rotate](../packages/rotate/README.md)|

[:rocket: return to directory](#directory)

## AnyTouch. Status Code

Recognizer state, there are 6 states in total.

````javascript
import AnyTouch from 'any-touch`;
const {STATUS_POSSIBLE, STATUS_RECOGNIZED} = AnyTouch;
````

| Variable              | Describe                                                                         |
| ----------------- | ---------------------------------------------------------------------------- |
| STATUS_POSSIBLE   | 表示当前还"未识别"                                                           |
| STATUS_START      | "**Drag class**" gestures (pan/pinch/rotate, etc.) means "first recognition."                     |
| STATUS_MOVE       | "Drag and drop" gesture means "moving after recognition"                                             |
| STATUS_END        | The "drag-like" gesture means "when the contact leaves, the gesture ends"                                  |
| STATUS_CANCELLED  | After the gesture is recognized, event interruption occurs, such as "incoming call", "browser minimization", etc.                       |
| STATUS_FAILED     | Indicates "recognition failure", such as when recognizing a tap, the contact does not leave the screen within 250ms, etc.          |
| STATUS_RECOGNIZED | Indicates "recognized", which is different from "drag-like" gestures, used in "instant" recognized gestures, such as tap/press/swipe. |

Generally used in conjunction with [beforeEach](#beforeeachhook) to control gesture triggering.

[:rocket: return to directory](#directory)
