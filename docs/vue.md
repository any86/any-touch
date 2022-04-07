## vue & Directives

By default, all gestures will trigger native DOM events, so in vue, you can use syntax such as "@tap" to listen for gesture events directly on template elements.

```html
<template>
    <div @tap="onTap" @swipe="onSwipe" @press="onPress" @pan="onPan" @pinch="onPinch" @rotate="onRotate">
        <!-- Gesture events can also be monitored on child elements -->
        <p tap="onTap" @swipe="onSwipe" @press="onPress" @pan="onPan" @pinch="onPinch" @rotate="onRotate">Hello any-touch</p>
    </div>
</template>

<script>
    import AnyTouch from 'any-touch';
    export default {
        mounted() {
            const at = new AnyTouch(this.$el);
            //  destroy
            this.$on('hook:destroyed', () => {
                at.destroy();
            });
        },
    };
</script>
```

**Note**: The syntax "**@tap**" in vue can only be used on element tags, but not on custom component tags:

```html
<!-- valid -->
<div @tap="onTap"></div>

<!-- invalid, can't monitor tap -->
<u-component @tap="onTap"></u-component>
```

### Directive

To simplify further, you can use `@any-touch/vue3` directly, which is a vue3 directive.

```javascript
// main.js
import VTouch from '@any-touch/vue3';
const app = createApp();
app.use(VTouch);
```
You can now use the `v-touch` directive in templates to add gesture recognition to the current element.
``` html
// xx.vue
<template>
    <xx-component v-touch  
        @tap="onTap" @swipe="onSwipe" @press="onPress" @pan="onPan" @pinch="onPinch" @rotate="onRotate"></xx-component>
</template>
```
[More](/packages/vue3/README.md)

### Compared
1. The directive version can be used on **elements/vue components**, while the native version only supports elements.
2. The instruction version **does not support on-demand loading** for the time being. For library developers, it is recommended to use the native version.

[:rocket: back to directory](../README.md#directory)
