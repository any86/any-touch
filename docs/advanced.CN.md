# 进阶使用

-   [阻止默认事件](#阻止默认事件)
-   [双击(doubletap)](https://github.com/any86/any-touch/tree/master/packages/doubletap)
-   ["at:xxx"统一事件](#atxxx事件)



## 阻止默认事件

参数"preventDefault"是一个函数, 可以通过他的返回值的"true/false"来决定是否"阻止默认事件".

**比如实现**: 阻止多点触发的事件的"默认事件", 比如"pinch/rotate".

```javascript
const at = new AnyTouch(el, {
    preventDefault(e) {
        return 1 == e.touches.length;
    },
});
```

参数"**e**"是原生事件对象, 移动端是[TouchEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent), PC 端是[MouseEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/MouseEvent).

[:rocket: 返回目录](../README.md#目录)



### "at:xxx"事件

宽泛的事件钩子.

| 名称         | 说明                        |
| ------------ | --------------------------- |
| at:start     | 开始触碰/触点增加触发       |
| at:move      | 触点移动触发                |
| at:end       | 触点离开触发                |
| **at:after** | 任意事件触发后,其都会被触发 |

"at:after"的事件对象和其他事件的不同, 多一个 name 字段, 这个 name 表示哪个事件引起的"at:after".

```typescript
at.on('at:after', (e) => {
    // ⭐tap/pan/swipe/press/pinch/rotate/at:start/at:move/at:end
    console.log(e.name);
});
```

[:rocket: 返回目录](../README.md#目录)
