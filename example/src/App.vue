<template>
    <main>
        <header>
            <a target="_new" href="https://github.com/any86/any-touch">
                <img width="100" src="https://img.shields.io/github/stars/any86/any-touch?style=social"/>
            </a>

            <a class="link" target="_new" href="https://github.com/any86/any-touch">文档</a>
        </header>
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
                @swipe="onSwipe($event,index)"
                @pinch="onPinch($event,index)"
                @rotate="onRotate($event,index)"
                @transitionend="onTransitionend($event,index)"
                :class="['circle']"
            >
                <p style="font-size:18px;border-bottom:1px dashed #fff;">👋可拖拽</p>
                <p>Top: {{top}}</p>
                <p>Left: {{left}}</p>
                <p>Scale: {{scale}}</p>
                <p>Angle: {{angle}}</p>
            </div>
        </article>

        <article class="info">
            <template  v-if="data.type">
                <h1>{{data.type}}</h1>
                <table>
                    <tr align="left">
                        <th>键值</th>
                        <th>值</th>
                        <th>说明</th>
                    </tr>
                    <tr  v-if="data[key]" v-for="{key,desc} in map"  :key="key">
                        <td>{{key}}</td>
                        <td>{{data[key]}}</td>
                        <td>{{desc}}</td>

                    </tr>
                </table>  
            </template>
            <h1 v-else>👋请拖拽</h1>
        </article>

        <p class="tip">
            👋 支持6类手势:
            <span >tap(点击)</span>
            <span>press(按)</span>
            <span>pan(拖拽)</span>
            <span >swipe(划)</span>
            <span >pinch(捏合)</span>
            <span>rotate(旋转)</span>
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
                {key:'baseType', desc: '基础事件名'},
                { key: 'x', desc: '触点中心X坐标' },
                { key: 'y', desc: '触点中心Y坐标' },
                { key: 'deltaX', desc: 'X轴位移增量' },
                { key: 'deltaY', desc: 'Y轴位移增量' },
                { key: 'displacementX', desc: 'X轴位移(矢量)' },
                { key: 'displacementY', desc: 'Y轴位移(矢量)' },
                { key: 'distanceX', desc: 'X轴移动距离' },
                { key: 'distanceY', desc: 'Y轴移动距离' },
                { key: 'distance', desc: 'X轴Y轴的合距离' },
                { key: 'speedX', desc: 'X轴移动速度(矢量)' },
                { key: 'speedY', desc: 'Y轴移动速度(矢量)' },
                { key: 'velocityX', desc: 'X轴移动速率' },
                { key: 'velocityY', desc: 'Y轴移动速率' },
                { key: 'deltaScale', desc: '每次触发pinch的缩放增量' },
                { key: 'scale', desc: '一个识别周期pinch的累计缩放量' },
                { key: 'deltaAngle', desc: '每次触发rotate的选装增量' },
                { key: 'angle', desc: '一个识别周期rotate的累计选装量' }
            ],
            action: '',
            data: {},
            styles: [
                { left: `50px`, top: `160px`, zIndex: 1, scale: 1, angle: 0 },
                { left: `50px`, top: `320px`, zIndex: 1, scale: 1, angle: 0 },
                { left: `50px`, top: `480px`, zIndex: 1, scale: 1, angle: 0 }
            ]
        };
    },

    mounted() {
        const at = new AnyTouch(this.$refs.panel);
        at.target(this.$refs.circle[1]).on('tap', this.onTap);
        // at.target(this.$refs.circle).on('press', this.onPress);
        at.on('at:after', this.afterEach);
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
            console.log(ev)
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
    // background-image: url('./assets/a.jpg');
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
    >header{
        display:flex;
        align-items:center;
        padding:28px;
        .link{
            font-size:16px;
            line-height:12px;
            color:#69c;
            margin-left:16px;
            text-decoration: none;
        }
    }
    >.title{
        margin-left:32px;
    }
    > .panel {
        .circle {
            position: absolute;
            width: 120px;
            height: 120px;
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
                transition: all 200ms ease-out;
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
        h1{padding:8px;}
        tr{ 
            td,th{padding:6px 8px;font-size:16px;}
        }
    }

    .tip {
        position: absolute;
        color: #000;
        bottom: 16px;
        right: 0;
        left: 0;
        font-size: 14px;
        padding: 0 24px;
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
