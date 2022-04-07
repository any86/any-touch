# Advanced use

- [block default event](#block default event)
- [doubletap](https://github.com/any86/any-touch/tree/master/packages/doubletap)
- ["at:xxx" unified event](#atxxx event)


## Block default events

The parameter "preventDefault" is a function that can decide whether to "prevent the default event" by its return value of "true/false".

**For example implementation**: The "default event" that prevents multi-triggered events, such as "pinch/rotate".

````javascript
const at = new AnyTouch(el, {
     preventDefault(e) {
         return 1 == e.touches.length;
     },
});
````

The parameter "**e**" is the native event object, the mobile terminal is [TouchEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent), and the PC terminal is [MouseEvent]( https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent).

[:rocket: back to directory](../README.md#directory)


### "at:xxx" event

Broad event hooks.

| Name | Description |
| ------------ | ----------------------------- |
| at:start | start touch/touch increase trigger |
| at:move | Contact move trigger |
| at:end | Contact leave trigger |
| **at:after** | After any event is triggered, it will be triggered |

The event object of "at:after" is different from other events, it has one more name field, this name indicates which event caused "at:after".

```typescript
at.on('at:after', (e) => {
     // ⭐tap/pan/swipe/press/pinch/rotate/at:start/at:move/at:end
     console.log(e.name);
});
````

[:rocket: back to directory](../README.md#directory)