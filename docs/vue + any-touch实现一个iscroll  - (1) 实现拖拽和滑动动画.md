# vue + any-touch实现一个iscroll ? - (1) 实现拖拽和滑动动画
![https://github.com/383514580/any-touch](https://ws1.sinaimg.cn/large/005IQkzXly1g1tac1367sj30pe03l3yq.jpg)

[<svg height="16" class="octicon octicon-mark-github" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>any-touch](https://github.com/383514580/any-touch)

## 先看demo
[demo](https://jsrun.net/WFXKp)

**本次文章先实现内容拖拽, 后续文章一步一步增加功能, 比如滚动条/ 下拉加载等功能.**

![](https://user-gold-cdn.xitu.io/2019/4/7/169f5d0406d46d1b?w=640&h=489&f=gif&s=1397496)

## 说点湿的
**iscroll**其实代码量挺大的(近2100行, 还有另一个类似的库**betterScroll**他的代码量和iscroll差不多, 因为原理都是一样的), 阅读他们的代码
发现里面很多逻辑**其实都是在做手势判断**, 比如拖拽(pan), 和划(swipe), 还有部分元素(表单元素等)需要单独判断点击(tap), 这部分代码接近1/3, 所以我决定用自己开发的手势库(any-touch)实现一个iscroll, 同时配合文字让大家**最终都可以以最少的代码实现一个iscroll**. 

## vue
观察了一段时间推荐排行, 发现大家都对**vue**感兴趣, 所以本次的"iscroll"将以vue组件的形式实现, 同时我也希望借助vue强大的抽象能力, **让最终代码控制在500行以内**, 希望大家喜欢.

## 本文是个系列文章
**本文先实现拖拽和滑动动画**, 因为这2部分都依赖**手势**, 借此用最少的代码先实现最核心的功能, 也让大家对后续的内容有信心.

## 简单说下iscroll原理
添加2个div, 最内的div(子div)通过设置css的transform的translate的值来模拟系统滚动效果.

## 说完逻辑再说代码
1. 拖拽的时候通过panstart/panmove手势返回的**位移增量**(deltaX/Y)进行位置变化, 同时关闭动画效果.
2. 发生快速划(swipe)的时候, 开启动画, 同时通过计算**目标位置**和**动画时间**来触发滑动动画.


## 代码
```html
<div class="any-scroll-view">
    <div ref="body" :style="bodyStyle" class="any-scroll-view__body"><slot></slot></div>
</div>
```

```css
.any-scroll-view {
    position: relative;
    width: 100%;
    height: 90vh; 
    overflow: hidden;

    &__body {
        transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);
        background: #eee;
        position: absolute;
        width: 100%;
        height: 100%;
    }
}
```

``` javascript
import AnyTouch from 'any-touch';
export default {
    name: 'any-scroll-view',

    props: {
        // 减速度, 单位px/s²
        acceleration: {
            type: Number,
            default: 3600
        }
    },

    data() {
        return {
            scrollTop: 0,
            scrollLeft: 0,
            transitionDuration: 300
        };
    },

    computed: {
        bodyStyle() {
            return {
                transitionDuration: `${this.transitionDuration}ms`,
                transform: `translate(${this.scrollLeft}px, ${
                    this.scrollTop
                }px)`
            };
        }
    },

    mounted() {
        const at = new AnyTouch(this.$el);

        // 第一次触碰
        at.on('inputstart', (ev) => {
            this.stopRoll();
        });

        // 拖拽开始
        at.on('panstart', (ev) => {
            this.move(ev);
        });

        // 拖拽中
        at.on('panmove', (ev) => {
            this.move(ev);
        });

        // 快速滑动
        at.on('swipe', (ev) => {
            this.decelerate(ev);
        });

        this.$on('hook:destroy', () => {
            at.destroy();
        });
    },

    methods: {
        // https://github.com/nolimits4web/swiper/blob/master/dist/js/swiper.esm.js#L87
        // https://github.com/nolimits4web/Swiper/blob/master/src/utils/utils.js#L25
        getCurrentTranslate() {
            const style = getComputedStyle(this.$refs.body, null);
            const { transform } = style;
            const array = transform.match(/(\-?)(\d)+(\.\d{0,})?/g);
            return { x: Math.round(array[4]), y: Math.round(array[5]) };
        },

        stopRoll() {
            const { x, y } = this.getCurrentTranslate();
            this.moveTo({ scrollTop: y, scrollLeft: x });
        },

        /**
         * 移动body
         * @param {Object} 拖拽产生的数据
         *  @param {Number} deltaX: x轴位移变化
         *  @param {Number} deltaY: y轴位移变化
         */
        move({ deltaX, deltaY }, transitionDuration = 0) {
            this.transitionDuration = transitionDuration;
            this.scrollLeft += deltaX;
            this.scrollTop += deltaY;
        },

        /**
         * 移动到
         */
        moveTo({ scrollTop, scrollLeft }, transitionDuration = 0) {
            this.transitionDuration = transitionDuration;
            this.scrollLeft = scrollLeft;
            this.scrollTop = scrollTop;
        },

        /**
         * 拖拽松手后减速移动至停止
         * velocityX/Y的单位是px/ms
         */
        decelerate(ev) {
            const directionSign = { up: -1, right: 1, down: 1, left: -1 }[
                ev.direction
            ];

            // Top? | Left?
            let SCROLL_SUFFIX = 'Top';
            // x ? | y?
            let AXIS_SUFFIX = 'Y';
            if (ev.velocityX > ev.velocityY) {
                SCROLL_SUFFIX = 'Left';
                AXIS_SUFFIX = 'X';
            }

            // 减速时间, 单位ms
            // t = (v₂ - v₁) / a
            const velocity = ev[`velocity${AXIS_SUFFIX}`];
            this.transitionDuration = Math.round(
                ((velocity * 1000) / this.acceleration) * 1000
            );

            // 滑动距离
            // s = (v₂² - v₁²) / (2 * a)
            const scrollAxis = `scroll${SCROLL_SUFFIX}`;
            this[scrollAxis] +=
                directionSign *
                Math.round(
                    Math.pow(velocity * 1000, 2) / (2 * this.acceleration)
                );
        }
    }
};
```

## 下一期
大家也发现了, 只有页面在滚动, 没有滚动条, 所以下期我们讲如何给scroll-view加上滚动条.

## 有不明白的地方
请留言, 知无不言, 言无不尽. 如觉得本文对您有帮助, 就请给[any-touch](https://github.com/383514580/any-touch)一个star吧, 谢谢.

