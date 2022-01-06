# @any-touch/doubletap
**双击**识别器. 基于[@any-touch/tap](https://github.com/any86/any-touch/tree/master/packages/tap)实现, 是tap的一个特例.

## 快速开始
```javascript
// 只加载tap识别器(拖拽)
import Core from '@any-touch/core';
import doubletap from '@any-touch/doubletap';
const at = new Core(el);
at.use(doubletap)

// 双击
at.on('doubletap', (event) => {
    console.log(event) // 包含点击位置信息
});
```
**⚠️注意**: 使用doubletap后, tap每次触发会延迟300ms, 以便区分是2次tap还是doubletap.

## 源码解析
因为是基于[@any-touch/tap](https://github.com/any86/any-touch/tree/master/packages/tap)实现的, 所以代码不多, 只是使用[beforeEach拦截器](https://github.com/any86/any-touch/blob/master/docs/API.md#beforeeachhook).
```typescript
export default function (at: Core) {
    at.use(tap, { name: 'doubletap', tapTimes: 2 });
    const doubleTapContext = at.get('doubletap')
    let timeID: number;
    at.beforeEach((type, next) => {
        if ('tap' === type) {
            clearTimeout(timeID);
            timeID = setTimeout(() => {
                if ([STATE.POSSIBLE, STATE.FAILED].includes(doubleTapContext.state)) {
                    next();
                }
            }, 300);
        } else {
            next();
        }
    });
    return doubleTapContext;
}
```

这里只需要多理解一个概念就是STATE(识别器的状态).
|名称|解释|
|---|---|
|POSSIBLE|待识别|
|RECOGNIZED|已识别|
|FAILED|识别失败|


识别流程如下, 每次点击屏幕, STATE是"**POSSIBLE**状态, 识别成功后状态变成"**RECOGNIZED**", 识别失败变成"**FAILED**".

特别解释下"**FAILED**"的发生情况,用doubletap识别器举例, 当2次点击间隔时间过长, doubletap的状态就会变成"**FAILED**", 当第三次点击的时候状态又变回"**POSSIBLE**".

[完整源码](https://github.com/any86/any-touch/blob/master/packages/doubletap/src/index.ts)

## N击
如果看懂了双击的逻辑, 那么稍作修改就可以实现"3击".
```typescript
export default function (at: Core) {
    // ⭐只有这一行的tapTimes改成了3
    at.use(tap, { name: 'doubletap', tapTimes: 3 });

    // 未改动
    const doubleTapContext = at.get('doubletap')
    let timeID: number;
    at.beforeEach((type, next) => {
        if ('tap' === type) {
            clearTimeout(timeID);
            timeID = setTimeout(() => {
                if ([STATE.POSSIBLE, STATE.FAILED].includes(doubleTapContext.state)) {
                    next();
                }
            }, 300);
        } else {
            next();
        }
    });
    return doubleTapContext;
}
```