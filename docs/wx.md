## 支持微信小程序

由于**小程序中没有 dom 元素**的概念, 所以我们需要通过**catchEvent**方法手动接收**touch**事件的事件对象来进行识别

```xml
<view
  @touchstart="at.catchEvent"
  @touchmove="at.catchEvent"
  @touchend="at.catchEvent"
  @touchcancel="at.catchEvent">
</view>
```

```javascript
const at = new AnyTouch()
{
    onload(){
        at.on('press', onPress);
    }
}
```

[:rocket: 返回目录](../README.md#目录)
