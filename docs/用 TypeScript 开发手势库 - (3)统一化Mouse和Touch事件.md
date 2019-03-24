# 用TypeScript开发手势库 - (3)统一化Mouse和Touch事件
![https://github.com/383514580/any-touch](https://ww1.sinaimg.cn/large/005IQkzXly1g1as0lsa1hj30m805ugmp.jpg)

 [any-touch](https://github.com/383514580/any-touch) 一个手势库

## 往期目录
[用 TypeScript 开发手势库 - (1)web开发常用手势有哪些?](https://juejin.im/post/5c8fc2105188252d72550acf)
[用 TypeScript 开发手势库 - (2)web开发常用手势有哪些?](https://juejin.im/post/5c939c956fb9a0710a1bc90c)

## 简单看下架构
![架构](https://ws1.sinaimg.cn/large/005IQkzXly1g1e7e5pm0tj30o20aegmc.jpg)

## 实现输入格式统一(input)
为了同时支持鼠标和touch设备, 我们第一步把2种设备产生数据统一化, 统一化后的数据我们统一叫他input.

### 4个基础,7个快捷
input包含11个字段,4个基础字段,7个快捷字段, 这些都是为下一步进行计算处理(computed)使用.

### 4个基础字段
input包含4个基础字段:eventType / point / changedPoints / nativeEvent, 接下来依次解释.

#### eventType
eventType可以理解为输入状态, 如touchstart/mousedown对应**start**, touchmove/mousemove对应**move**, touchend/mouseleave对应**end**, touchcancel对应**cancel**, 总计4种状态.

#### point
触点信息, 存储当前触点相对浏览器窗口左上角的坐标(clientX, clientY), point是个数组, 存储当前的所有触点.

#### changedPoints
发生变化的触点信息, 是个数组, 存储着**上一次触点相对当前触点发生变化**的触点(初看有些绕, 如不明可留言.).

#### nativeEvent
如果是touch设备, 那么对应touchEvent, 鼠标对应MouseEvent.

**处理touchEvent**
```typescript
export default (event: TouchEvent): any => {
    const point = Array.from(event.touches).map(({clientX,clientY})=>({clientX,clientY}));
    const changedPoints = Array.from(event.changedTouches).map(({clientX,clientY})=>({clientX,clientY}));
    const eventType = event.type.replace('touch', '');
    return {
        eventType,
        changedPoints,
        point,
        nativeEvent: event,
    };
}; 
```
**处理mouseEvent**
```typescript
let prevPoints: { clientX: number, clientY: number }[];
let isPressed = false;
// 默认MouseEvent中对type声明仅为string
export default (event: MouseEvent): BaseInput | void => {
    let { clientX, clientY, type, button } = event;
    const changedPoints = prevPoints || [{ clientX, clientY }];

    let points = [{ clientX, clientY }];
    prevPoints = [{ clientX, clientY }];

    // 必须左键
    if ('mousedown' === type) {
        if (0 === button) {
            isPressed = true;
        } else {
            return;
        }
    }

    if ('mousemove' === type) {
        if (!isPressed) return;
    } else if ('mouseup' === type) {
        if (isPressed) {
            points = [];
        } else {
            return;
        };
        isPressed = false;
    }

    const MAP = {
        mousedown: 'start',
        mousemove: 'move',
        mouseup: 'end'
    };

    return {
        eventType: <eventType>MAP[<'mousedown' | 'mousemove' | 'mouseup'>type],
        changedPoints,
        points,
        nativeEvent: event
    };
}; 
```

[源码](https://github.com/383514580/any-touch/tree/master/src/input/adapters)


### 7个快捷字段
快捷字段均由基础字段简单衍生而来, 仅为了使用方便而直接放在这.

#### pointLength
对应point数组的长度.

#### changedPointLength
对应changedPoints的长度.

#### timestamp
当前时间戳.


#### target
绑定事件的元素.

#### currentTarget
触发事件所在元素.

#### center
触点坐标, 如果是多点, 那么对应多点的中心坐标([getCenter函数源码](https://github.com/383514580/any-touch/blob/master/src/vector.ts#L74)).

#### x/y
对应center.x和center.y

#### isFirst
是否本轮识别周期的开始, 如果当前的**eventType**为start阶段, pointLength和changedPointLength的长度相等, 那么可以判定, 当前为开始.

#### isFinal
是否本轮识别周期的结束, 如果当前的**eventType**为end或者cancel阶段, 且所有触点均离开, 那么判定为结束.

扩展字段的源码比较长, 请移步至[仓库](https://github.com/383514580/any-touch/blob/master/src/input/create.ts).

## 下期预告
下期我们会讲解computed, 计算阶段比较复杂, 设计到input的开始/前一个/当前状态的计算, 大家可以提前预热.

[compute部分源码](https://github.com/383514580/any-touch/tree/master/src/compute)