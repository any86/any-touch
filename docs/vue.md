## vue&指令

默认所有手势都会触发原生 DOM 事件, 所以在 vue 中可在模版元素上直接使用"@tap"等语法监听手势事件.

```html
<template>
    <div @tap="onTap" @swipe="onSwipe" @press="onPress" @pan="onPan" @pinch="onPinch" @rotate="onRotate">
        <!-- 子元素上也可监听手势事件 -->
        <p tap="onTap" @swipe="onSwipe" @press="onPress" @pan="onPan" @pinch="onPinch" @rotate="onRotate">Hello any-touch</p>
    </div>
</template>

<script>
    import AnyTouch from 'any-touch';
    export default {
        mounted() {
            const at = new AnyTouch(this.$el);
            //  销毁
            this.$on('hook:destroyed', () => {
                at.destroy();
            });
        },
    };
</script>
```

**注意**: vue 中 "**@tap**"这种语法**只能**用在元素标签上, 而**不能**用在自定义组件标签上:

```html
<!-- 有效 -->
<div @tap="onTap"></div>

<!-- 不生效, 监听不到tap -->
<u-component @tap="onTap"></u-component>
```

### 指令

进一步简化, 可以直接使用`@any-touch/vue3`, 是一个 vue3 指令.

```javascript
// main.js
import VTouch from '@any-touch/vue3';
const app = createApp();
app.use(VTouch);
```
现在可以在模板中使用`v-touch`指令来给当前元素增加手势识别.
``` html
// xx.vue
<template>
    <xx-component v-touch  
        @tap="onTap" @swipe="onSwipe" @press="onPress" @pan="onPan" @pinch="onPinch" @rotate="onRotate"></xx-component>
</template>
```
[更多介绍](/packages/vue3/README.md)

### 对比
1. 指令版本可以用在**元素/vue组件**上, 而原生版本只支持元素.
2. 指令版**暂不支持按需加载**, 对于库的开发者, 推荐使用原生版本.

[:rocket: 返回目录](../README.md#目录)
