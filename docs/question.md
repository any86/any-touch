## 常见问题
-   [不要用 alert 调试](#不要用-alert-调试)
-   [macos 上的 chrome 浏览器触发 touchend 会比较慢](#macos-上的-chrome-浏览器触发-touchend-会比较慢)
-   [移动端尽量使用 tap 代理 click](#移动端尽量使用-tap-代理-click)
-   [使用 pnpm 提示找不到@any-touch/xxx](#使用pnpm提示找不到any-touchxxx)

### 手势识别器的 name 字段必填

自定义手势**一定记得给起一个名字哦**, 而且不要和默认存在的手势同名(已有 tap/swipe/pan/rotate/pinch/press).

```javascript
at.use(tap, { pointLength: 2, name: 'twoFingersTap' });
at.on('twoFingersTap', onTwoFingersTap);
```

[:rocket: 返回目录](../README.md#目录)

### 不要用 alert 调试

在安卓手机的真机上, 如果`touchstart`或`touchmove`阶段触发了`alert`, 会出现后续的`touchmove/touchend`不触发的 bug. 所以请大家务必避免在手势的事件回调中使用`alert`.
[测试代码](https://codepen.io/russell2015/pen/vYBjVNe)

如果仅仅是了在移动端调试, 请使用腾讯的[vconsole](https://github.com/Tencent/vConsole)

[:rocket: 返回目录](../README.md#目录)

### macos 上的 chrome 浏览器触发 touchend 会比较慢

由于上述原因, swipe 事件发生的会"慢半拍",所以请大家最终测试以手机效果为准.

[:rocket: 返回目录](../README.md#目录)

### 移动端尽量使用 tap 代理 click

在移动端 touchstart 比 click 先触发, 所以 touchstart 阶段的 preventDefault 会阻止 click 触发, 恰恰 any-touch 默认在 touchstart 中使用了`preventDefault`, 用来阻止了浏览器默认事件的触发,比如 click 和页面滚动.

如果移动端非要使用 click 做如下设置

```javascript
const at = new AnyTouch(el, { preventDefault: false });
```

[:rocket: 返回目录](../README.md#目录)

### 使用 pnpm 提示找不到@any-touch/xxx

这是因为**pnpm 不像 yarn 和 npm, 其不会把 any-touch 依赖的包安装到 node_modules 目录的根**, 所以会提示找不到. [参考 pnpm 说明](https://pnpm.io/zh/faq#%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%881).

如果使用 pnpm, 那么只能通过手动安装包解决.

```shell
pnpm i @any-touch/core @any-touch/tap @any-touch/press @any-touch/pan @any-touch/swipe @any-touch/pinch @any-touch/rotate
```

### 使用了 AnyTouch 后页面不能滑动了?

因为 AnyTouch 默认开启了"preventDefault:true", 你可以设置他为"false", 但是如果交互情况比较复杂未能满足, 你可以参考[阻止默认事件](#阻止默认事件)

[:rocket: 返回目录](../README.md#目录)
