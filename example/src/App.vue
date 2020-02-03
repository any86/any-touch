<template>
    <main>
        <p
            class="tip"
        >支持手势更全面: tap(点击) / press(按) / pan(拖拽) / swipe(划) / pinch(捏合) / rotate(旋转) 6大类手势.</p>
        <div
            ref="circle"
            v-for="({top,left,zIndex,scale,angle},index) in styles"
            :style="{top,left,zIndex,transform:`scale(${scale}) rotate(${angle}deg)`}"
            :key="index"
            :index="index"
            @at:touch="onTouch($event,index)"
            @panstart="onPanstart($event,index)"
            @panmove="onPanmove($event,index)"
            @swipe="onSwipe($event,index)"
            @pinch="onPinch($event,index)"
            @rotate="onRotate($event,index)"
            @transitionend="onTransitionend($event,index)"
            :class="['circle']"
            :at="action"
            :at-stage="stage"
        >
            <p>Top: {{top}}</p>
            <p>Left: {{left}}</p>
            <p>Scale: {{scale}}</p>
            <p>Angle: {{angle}}</p>
        </div>
    </main>
</template>

<script>
/* eslint-disable */
function C(text, bgColor = '#000', color = '#fff') {
    console.log(`%c${text}`, `color:${color};background-color:${bgColor};padding:2px 6px;border-radius:4px;`);
}
// import VConsole from 'vconsole';
// new VConsole();
import AnyTouch from '../../packages/any-touch/dist/any-touch.umd';
export default {
    data() {
        return {
            action: '',
            stage: '',
            styles: [
                { left: `100px`, top: `100px`, zIndex: 1, scale: 1, angle: 0 },
                { left: `200px`, top: `200px`, zIndex: 1, scale: 1, angle: 0 },
                { left: `300px`, top: `300px`, zIndex: 1, scale: 1, angle: 0 }
            ]
        };
    },

    mounted() {
        const at = new AnyTouch(this.$el);
        at.target(this.$refs.circle).on('tap' + '第一个圆', this.onTap);
        at.target(this.$refs.circle).on('press', this.onPress);

        // at.on('at:touch', (ev) => {
        //     this.stage = ev.inputType;
        // });
        // at.on('at:after', (ev) => {
        //     this.action = ev.baseType;
        // });
    },

    methods: {
        onTouch(ev, index) {},
        onRotate(ev, index) {
            this.styles[index].angle += ev.deltaAngle;
        },
        onTransitionend(ev, index) {},
        onTap(ev) {
            this.action = ev.type;
            C(ev.type, '#f10');
        },

        onPress(ev) {
            C(ev.type, '#710');
        },
        onPinch(ev, index) {
            this.styles[index].scale = Math.round(this.styles[index].scale * ev.deltaScale * 100) / 100;
        },

        onSwipe({ speedX, speedY }, index) {
            this.styles[index].top = Math.round(parseInt(this.styles[index].top) + speedY * 120) + 'px';
            this.styles[index].left = Math.round(parseInt(this.styles[index].left) + speedX * 120) + 'px';
        },

        onPanstart(ev, index) {
            for (const i in this.styles) {
                this.styles[i].zIndex = i == index ? 2 : 1;
            }
        },

        onPanmove(ev, index) {
            this.styles[index].top = parseInt(this.styles[index].top) + ev.deltaY + 'px';
            this.styles[index].left = parseInt(this.styles[index].left) + ev.deltaX + 'px';
        }
    }
};
</script>

<style lang="scss">
* {
    padding: 0;
    margin: 0;
    // background-image: url('./assets/a.jpg');
}
// .circle[at^='pan'] {
//     transform: scale(2);
// }

@keyframes Tap {
    from {
        transform: scale(0.9);
    }

    to {
        transform: scale(1);
    }
}

main {
    position: relative;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.9);
    height: 100vh;
    width: 100%;
    .tip {
        color: #fff;
        font-size: 1em;
    }
    .circle {
        position: absolute;
        width: 100px;
        height: 100px;
        border-radius: 4px;
        color: #fff;
        padding: 16px;
        &:hover {
            cursor: pointer;
        }
        &:nth-of-type(3n + 1) {
            background-color: rgba(226, 47, 47, 0.8);
        }
        &:nth-of-type(3n + 2) {
            background-color: rgba(134, 136, 45, 0.8);
        }
        &:nth-of-type(3n) {
            background-color: rgb(9, 206, 140, 0.8);
        }

        &[at='tap'][at-stage='end'] {
            animation: Tap 200ms;
        }

        &[at='press']:not([at-stage='end']) {
            transition: all 200ms;
            transform: scale(0.9) !important;
        }

        &[at='swipe'] {
            transition: all 200ms;
        }
        > p {
            line-height: 1.5;
        }
    }
}

// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
// }
</style>
