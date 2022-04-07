# load on demand

**The default any-touch supports all gestures**, in order to **smaller size**, provides on-demand loading.

## full import

````javascript
// Load only the pan recognizer (drag and drop)
import AT from 'any-touch';
const at = AT(el);
at.on('tap', (e) => {});
at.on('pan', (e) => {});
// Listen to multiple events at the same time
at.on(['swipe', 'press', 'rotate', 'pinch'], (e) => {});
````

## Import on demand

`@any-touch/core` is the core package, which is compatible with mouse/touch input. For specific gestures, the corresponding recognizer needs to be loaded, such as the `@any-touch/pan` drag recognizer.

```shell
npm i -S @any-touch/core # core
npm i -S @any-touch/tap #click
npm i -S @any-touch/pan # drag and drop
npm i -S @any-touch/press #press
npm i -S @any-touch/swipe # swipe
npm i -S @any-touch/pinch # zoom
npm i -S @any-touch/rotate # rotate
npm i -S @any-touch/doubletap # double tap (special case extended by tap)
````

**Merge into one line:**

```shell
npm i -S @any-touch/core @any-touch/tap @any-touch/pan @any-touch/press @any-touch/swipe @any-touch/pinch @any-touch/rotate @any-touch /doubletap
````

````javascript
// Load only the pan recognizer (drag and drop)
import Core from '@any-touch/core';
import pan from '@any-touch/pan
// Core doesn't recognize any gestures.
const at = new Core(el);
// load pan
at.use(pan);

at.on('pan', e=>{});
````

## @any-touch/core

The core component of the gesture library, mainly used to achieve PC/mobile compatibility ([See more](../packages/core/README.md)).

## @any-touch/xx gesture recognizers

**Gesture recognizers** have been made into independent packages, so that they can be loaded on demand.

| Name | Description |
| --- | --- |
| **@any-touch/tap** | [click](../packages/tap/README.md) |
| **@any-touch/pan** | [drag](../packages/pan/README.md) |
| **@any-touch/swipe** | [swipe](../packages/swipe/README.md) |
| **@any-touch/press** | [press](../packages/press/README.md) |
| **@any-touch/pinch** | [zoom](../packages/pinch/README.md) |
| **@any-touch/rotate** | [rotate](../packages/rotate/README.md) |

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fa1a4dae46047d58b371e8ff1704dc8~tplv-k3u1fbpfcp-zoom-1.image)



[:rocket: back to directory](../README.md#directory)