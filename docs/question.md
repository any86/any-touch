## common problem
- [do not debug with alert](#dont-debug-with-alert)
- [The chrome browser on macos will trigger touchend slower](#the-chrome-browser-on-macos-will-be-slower-to-trigger-touchend)
- [Use the tap proxy click on the mobile terminal as much as possible](#try-to-use-the-tap-proxy-on-the-mobile-terminal-click)

### The name field of the gesture recognizer is required

The custom gesture **must remember to give a name**, and do not have the same name as the default gesture (already tap/swipe/pan/rotate/pinch/press).

````javascript
at.use(tap, { pointLength: 2, name: 'twoFingersTap' });
at.on('twoFingersTap', onTwoFingersTap);
````

[:rocket: back to directory](../README.md#directory)

### Don't debug with alert

On a real Android phone, if `alert` is triggered during the `touchstart` or `touchmove` stage, there will be a subsequent bug that `touchmove/touchend` does not trigger. So please avoid using `alert` in the gesture event callback `.
[Test code](https://codepen.io/russell2015/pen/vYBjVNe)

If you are only debugging on the mobile terminal, please use Tencent's [vconsole](https://github.com/Tencent/vConsole)

[:rocket: back to directory](../README.md#directory)

### The chrome browser on macOS will be slower to trigger touchend

Due to the above reasons, the swipe event will be "half a beat", so please make the final test based on the mobile phone effect.

[:rocket: back to directory](../README.md#directory)

### Try to use the tap proxy on the mobile terminal click

On the mobile side, touchstart is triggered before click, so preventDefault in the touchstart phase will prevent click from triggering. It is precisely that any-touch uses `preventDefault` in touchstart by default to prevent the triggering of browser default events, such as click and page scrolling.

If the mobile terminal must use click to do the following settings

````javascript
const at = new AnyTouch(el, { preventDefault: false });
````

[:rocket: back to directory](../README.md#directory)



### Can't slide the page after using AnyTouch?

Because AnyTouch has "preventDefault:true" enabled by default, you can set it to "false", but if the interaction situation is more complicated and cannot be satisfied, you can refer to [Prevent Default Events](API.md#options)

[:rocket: back to directory](../README.md#directory)