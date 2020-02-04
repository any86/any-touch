<template>
    <main>
        <article ref="panel" class="panel">
            <div
                ref="circle"
                v-for="({top,left,zIndex,scale,angle},index) in styles"
                :style="{top,left,zIndex,transform:`scale(${scale}) rotate(${angle}deg)`}"
                :key="index"
                :index="index"
                @at:touch="onTouch"
                @at:after="onAfter($event,index)"
                @panstart="onPanstart($event,index)"
                @panmove="onPanmove($event,index)"
                @pinch="onPinch($event,index)"
                @rotate="onRotate($event,index)"
                @transitionend="onTransitionend($event,index)"
                :class="['circle']"
            >
                <p>Top: {{top}}</p>
                <p>Left: {{left}}</p>
                <p>Scale: {{scale}}</p>
                <p>Angle: {{angle}}</p>
            </div>
        </article>

        <article class="info">
            <table>
                <tr  v-if="data[key]" v-for="{key,title} in map"  :key="key">
                    <td>{{title}}</td>
                    <td>{{key}}</td>
                    <td>{{data[key]}}</td>
                </tr>
            </table>
        </article>

        <p class="tip">
            支持6类手势:
            <span :class="{active:'tap' === action}">tap(点击)</span>
            <span :class="{active:'press' === action}">press(按)</span>
            <span :class="{active:'pan' === action}">pan(拖拽)</span>
            <span :class="{active:'swipe' === action}">swipe(划)</span>
            <span :class="{active:'pinch' === action}">pinch(捏合)</span>
            <span :class="{active:'rotate' === action}">rotate(旋转)</span>
        </p>
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
            map: [
                { key: 'deltaX', title: 'X位移增量' },
                { key: 'deltaY', title: 'X位移增量' },
                { key: 'displacementX', title: 'displacementX' },
                { key: 'displacementY', title: 'displacementY' },
                { key: 'distanceX', title: 'distanceX' },
                { key: 'distanceY', title: 'distanceY' },
                { key: 'distance', title: 'distance' },
                { key: 'speedX', title: 'speedX' },
                { key: 'speedY', title: 'speedY' },
                { key: 'x', title: '触点中心X坐标' },
                { key: 'y', title: '触点中心Y坐标' },
                { key: 'deltaScale', title: 'deltaScale' },
                { key: 'scale', title: 'scale' },
                { key: 'deltaAngle', title: 'deltaAngle' },
                { key: 'angle', title: 'angle' }
            ],
            action: '',
            data: {},
            styles: [
                { left: `100px`, top: `100px`, zIndex: 1, scale: 1, angle: 0 },
                { left: `200px`, top: `200px`, zIndex: 1, scale: 1, angle: 0 },
                { left: `300px`, top: `300px`, zIndex: 1, scale: 1, angle: 0 }
            ]
        };
    },

    mounted() {
        const at = new AnyTouch(this.$refs.panel);
        at.target(this.$refs.circle[1]).on('tap', this.onTap);
        // at.target(this.$refs.circle).on('press', this.onPress);
        // at.target(this.$refs.circle[0]).on('at:after', this.afterEach);
        // at.on('pan', ev=>{
        //     console.warn(ev.target)
        // })
        // at.on('at:touch', (ev) => {
        //     this.stage = ev.inputType;
        // });
        // at.on('at:after', (ev) => {
        //     this.action = ev.baseType;
        // });
    },

    methods: {
        onAfter(ev){
            ev.currentTarget.setAttribute('at', ev.baseType);
        },
        onTouch(ev) {
            ev.currentTarget.setAttribute('at-stage', ev.inputType);

        },
        afterEach(ev) {
            this.action = ev.baseType;
            this.$set(this, 'data', ev);
        },
        onRotate(ev, index) {
            this.styles[index].angle += ev.deltaAngle;
        },
        onTransitionend(ev, index) {},
        onTap(ev) {
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
            // console.log(ev.target)
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
    //
}
body {
    background-image: url('./assets/a.jpg');
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
    // overflow: hidden;
    position: relative;
    z-index: 1;
    background-color: #eee;
    height: 100vh;
    width: 100%;

    > .panel {
        width:60vw;
        height:60vh;
        border:1px solid #ccc;

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

    > .info {
        position: absolute;
        box-sizing: border-box;
        background-color: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        padding: 16px;
        margin: 64px auto;
        bottom: 0;
        right: 0;
        left: 0;
        top: 0;
        width:96%;
        height:80vh;
        tr{ 
            td{padding:8px;}
        }
    }

    .tip {
        position: absolute;
        color: #000;
        bottom: 16px;
        right: 0;
        left: 0;
        font-size: 14px;
        padding: 0 16px;
        span {
            &:after {
                content: ' / ';
            }

            &.active {
                color: #f10;
            }
        }
    }
}
</style>
