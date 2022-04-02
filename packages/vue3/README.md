# @any-touch/vue3

any-touch 的 vue3 指令版本

## 安装

```shell
npm i -S @any-touch/vue3
```

## 快速开始

```javascript
// main.js

import VTouch from '@any-touch/vue3';
const app = createApp();
// ...
app.use(VTouch);
```

```html
// xxx.vue
<u-component v-touch @tap="onTap" @swipe="onSwipe" @press="onPress" @pan="onPan" @pinch="onPinch" @rotate="onRotate">
    <!-- 子元素也能监听事件 -->
    <div @tap="onTap" @swipe="onSwipe" @press="onPress" @pan="onPan" @pinch="onPinch" @rotate="onRotate">子元素</div>
</u-component>
```

**注意**: 一旦标记了`v-touch`, 那么当前元素及其子元素都可以监听到手势事件.


## 指令的值
`v-touch`的值是一个对象, 实际他就是any-touch的参数.
```html
<div v-touch="{preventDefault:false}"></div>
```

[any-touch参数说明](../../docs/API.md#options)