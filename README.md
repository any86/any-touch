# any-touch [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![size-image]][size-url] [![codecov](https://codecov.io/gh/any86/any-touch/branch/master/graph/badge.svg)](https://codecov.io/gh/any86/any-touch) [![CircleCI](https://circleci.com/gh/any86/any-touch.svg?style=svg)](https://circleci.com/gh/any86/any-touch)

[size-image]: https://badgen.net/bundlephobia/minzip/@any-touch/core
[size-url]: https://bundlephobia.com/result?p=@any-touch/core
[npm-image]: https://badgen.net/npm/v/any-touch
[npm-url]: https://npmjs.org/package/any-touch
[downloads-image]: https://badgen.net/npm/dt/any-touch
[downloads-url]: https://npmjs.org/package/any-touch

![gestures](https://user-images.githubusercontent.com/8264787/162208065-f347f3a5-266e-4fa0-be0a-6a439236d43d.png)


-   Support PC/Mobile/[WeChat applet](docs/wx.md).
-   6 gesture recognizers are loaded by default, can also be [loaded on demand](docs/optional.md), core **1kb**, full **5kb**.
-   **No dependencies, not limited to Vue / React / Angular etc...**

## Language
[中文](README.CN.md) | **English**

## Demo

<details>
<summary>QR Code</summary>
<img src="https://user-images.githubusercontent.com/8264787/104836031-a55ca780-58e5-11eb-936a-7e2d1a05ee86.png" />
</details>

[Simple](https://any86.github.io/any-touch)

[Derivatives: any-scroll](https://github.com/any86/any-scroll)

## Install

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

## Directory

[⚡ Get Started](#get-started)

-   [👋 Gesture](#gesture)

-   [🍭 Event](#event)

-   [🔹 Typescript](#typescript)

[🌱 Vue & Directives](docs/vue.md)

[🍀 WeChat applet](docs/wx.md)

[📐 Load on demand](docs/optional.md)

[🌈 Advanced](docs/advanced.md)

-   [prevenDefault](docs/advanced.md#阻止默认事件)
-   [doubletap](https://github.com/any86/any-touch/tree/master/packages/doubletap)

[:bulb: API](docs/API.md)

[🍳 Q & A](docs/question.md)


## Get Started

```javascript
import AnyTouch from 'any-touch';

// monitored element
const el = document.getElementById('box');

// Start monitoring gesture changes on el
const at = new AnyTouch(el);

// The pan event fires when dragging
at.on('pan', (e) => {
    // e contains information such as displacement/velocity/direction
    console.log(e);
});
```

The pan here is called [gesture event](#gesture). e is the [event object](#event), which contains data such as "position/speed/zoom/angle",

### 👋Gesture

Each state of the gesture corresponds to an event.

<table>
    <tr>
        <th><b>Gesture</th>
        <th>Name</th>
        <th>Describe</th>
    </tr>
    <tr>
        <td rowspan="5">pan</td>
        <td>pan</td>
        <td>Triggered continuously while dragging</td>
    </tr>
    <tr>
        <td>panstart</td>
        <td>drag to start</td>
    </tr>   
    <tr>
        <td>panmove</td>
        <td>dragging</td>
    </tr>  
    <tr>
        <td>panstart</td>
        <td>Drag to stop (off screen)</td>
    </tr>  
    <tr>
        <td>panup / pandown / panright / panleft</td>
        <td>Drag events in different directions</td>
    </tr>
    <tr>
        <td rowspan="2">press</td>
        <td>press</td>
        <td>Press</td>
    </tr>  
        <tr>
        <td>press</td>
        <td>Press release (off screen)</td>
    </tr>     
    <tr>
        <td>tap</td>
        <td>tap</td>
        <td>Click, No problem with 300ms delay</td>
    </tr>  
    <tr>
        <td rowspan="2">swipe</td>
        <td>swipe</td>
        <td>Swipe</td>
    </tr>  
    <tr>
        <td> swipeup / swipedown / swiperight / swipeleft</td>
        <td>Swipe in different directions</td>
    </tr>  
    <tr>
        <td rowspan="6">pinch</td>
        <td>pinch</td>
        <td>Zoom</td>
    </tr>  
    <tr>
        <td> pinchstart </td>
        <td>Zoom start</td>
    </tr>  
    <tr>
        <td> pinchmove </td>
        <td>Zooming</td>
    </tr>  
    <tr>
        <td> pinchend </td>
        <td>Zoom ends (off screen)</td>
    </tr>  
        <tr>
        <td> pinchin </td>
        <td>Zoom in</td>
    </tr>  
        <tr>
        <td> pinchout </td>
        <td>Zoom out</td>
    </tr>
    <tr>
        <td rowspan="6">rotate</td>
        <td>rotate</td>
        <td>Rotating, include rotatestart and rotatemove and rotateend </td>
    </tr>  
    <tr>
        <td> rotatestart </td>
        <td>Start of rotation</td>
    </tr>  
    <tr>
        <td> rotatemove </td>
        <td>Rotating</td>
    </tr>  
    <tr>
        <td> rotateend </td>
        <td>End of rotation (off screen)</td>
    </tr>

</table>

#### Combining events

You can listen to multiple events through the array, such as listening to panleft and panright at the same time, so that you can listen to "x-axis dragging".

```javascript
at.on(['panleft', 'panright'], () => {
    console.log('Drag on the x-axis');
});
```

[:rocket: back to directory](#directory)

### 🍭 Event

When the event is triggered, data such as "position/speed/zoom/angle" can be obtained.

```javascript
at.on('pan', (event) => {
    // event contains data such as speed/direction
});
```

#### event

| name            | type            | describe                                                                                                                 |
| --------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| name            | `String`        | **Gesture recognizer name**, such as: pan/tap/swipe, etc.                                                                                |
| type            | `String`        | **Event name**, such as `tap` or `panstart`, etc., is larger than the name field, such as: when the type is panstart or panmove, and the name returns pan
| phase           | `String`        | Current touch state: `start` / `move` / `end` / `cancel` Corresponding: `first touch` / `move on the screen` / `leave the screen` / `abnormally leave the "can anyTouch" element` |
| x               | `Number`        | Current contact center x coordinate                                                                                                  |
| y               | `Number`        | Current contact center y coordinate                                                                                                |
| deltaX          | `Number`        | The x-axis offset distance of the current contact and the previous contact                                                                                  |
| deltaY          | `Number`        | The y-axis offset distance of the current contact and the previous contact                                                                      |
| displacementX   | `Number`        | The x displacement of the current contact and the starting contact (vector)                                                                              |
| displacementY   | `Number`        | The y displacement of the current contact and the starting contact (vector)                                              |
| distanceX       | `Number`        | absolute value of displacementX                                                                                             |
| distanceY       | `Number`        | absolute value of displacementY                                                                                            |
| distance        | `Number`        | The distance between the current contact and the starting contact (scalar)                                                                       |
| deltaTime       | `Number`        | The difference between the current time and the initial touch time                                                                          |
| velocityX       | `Number`        | The moving speed of the contact on the X axis                                                                                                           |
| velocityY       | `Number`        | The moving speed of the contact on the Y axis                                                                                             |
| direction       | `Number`        | The direction of the front contact and the current contact can be understood as the instantaneous direction                                                         |
| angle           | `Number`        | When multi-touch, the rotation angle between the starting contact and the current contact                                                    |
| deltaAngle      | `Number`        | When multi-touch, the rotation angle between the front contact and the current contact                                                        |
| scale           | `Number`        | When multi-touch, the zoom ratio of the starting touch point and the current touch point                                                                       |
| deltaScale      | `Number`        | When multi-touch, the zoom ratio between the previous touch point and the current touch point                                             |
| maxPointLength  | `Number`        | The maximum number of contacts that have occurred in the current identification cycle                                                                                           |
| isStart         | `Boolean`       | Whether the current recognition cycle starts, the rule is that it is a cycle from touchstart->touchend, even if there is a multi-touch, if a point leaves, the current round of recognition ends              |
| isEnd           | `Boolean`       | Whether the current recognition cycle is over                                                                                              |
| target          | `EventTarget`   | The element to which the event is bound                                                                                             |
| targets         | `EventTarget[]` | For multiple touches, each target in touches will be stored                                                                       |
| currentTarget   | `EventTarget`   | The element that actually triggered the bound event                                                                                  |
| **nativeEvent** | `TouchEvent`    | native event object                                                                                                             |

[:rocket: back to directory](#directory)

## Typescript

If the event function is bound in the vue template, the type of the event object cannot be deduced, so we need to manually annotate it ourselves.

```html
<div @tap="onTap"></div>
```

```typescript
// xxx.vue
import type { AnyTouchEvent } from 'any-touch';
function onTap(e: AnyTouchEvent) {
    // It can be correctly deduced that there is an x attribute on e
    console.log(e.x);
}
```

[:rocket: back to directory](#directory)
