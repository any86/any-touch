## :lollipop: 事件对象

| 名称             | 数据类型      | 说明                                                                     |
| ---------------- | ------------- | ------------------------------------------------------------------------ |
| type             | `String`      | 事件名, 如 tap/pan 等                                                    |
| eventType        | `String`      | 事件类型: start \| move \| end \| cancel |
| x                | `Number`      | **当前触点中心**x 坐标                                                   |
| y                | `Number`      | **当前触点中心**y 坐标                                                   |
| deltaX           | `Number`      | **当前触点**和**前触点**的 x 轴偏移距离                                  |
| deltaY           | `Number`      | **当前触点**和**前触点**的 y 轴偏移距离                                  |
| deltaXYAngle     | `Number`      | **当前触点**相对**前触点**的角度变化(相对于 x 轴)                        |
| displacementX    | `Number`      | **当前触点**与**起始触点**的 x 位移(矢量)                                |
| displacementY    | `Number`      | **当前触点**与**起始触点**的 y 位移(矢量)                                |
| distanceX        | `Number`      | displacementX 的绝对值                                                   |
| distanceY        | `Number`      | displacementY 的绝对值                                                   |
| distance         | `Number`      | **当前触点**与**起始触点**的距离(标量)                                   |
| deltaTime        | `Number`      | **当前时间**与**起始时间**的差值                                         |
| velocityX        | `Number`      | 当前 x 速度, 每 25ms 进行一次刷新                                        |
| velocityY        | `Number`      | 当前 y 速度, 每 25ms 进行一次刷新                                        |
| direction        | `Number`      | **前触点**与**当前触点**的方向, 可以理解为瞬时方向, 每 25ms 进行一次刷新 |
| overallDirection | `String`      | `是否当前识别周期的开始`                                                 |
| angle            | `Number`      | 多点触摸时, **起始触点**与**当前触点**的旋转角度                         |
| deltaAngle       | `Number`      | 多点触摸时, **前触点**与**当前触点**的旋转角度                           |
| scale            | `Number`      | 多点触摸时, **起始触点**与**当前触点**的缩放比例                         |
| deltaScale       | `Number`      | 多点触摸时, **前触点**与**当前触点**的缩放比例                           |
| maxPointLength   | `Number`      | 本轮识别周期出现过的最大触点数                                           |
| isStart          | `Boolean`     | 是否当前识别周期的开始                                                   |
| isEnd            | `Boolean`     | 是否当前识别周期的结束                                                   |
| target           | `EventTarget` | 绑定事件的元素                                                           |
| currentTarget    | `EventTarget` | 实际触发绑定事件的元素                                                   |
| timestamp        | `Number`      | **当前时间**                                                             |
| **nativeEvent**  | `TouchEvent`  |原生事件对象   