<template>
    <main class="ovh">
        <header>
            <a target="_new" href="https://github.com/any86/any-touch">
                <img
                    width="100"
                    src="https://img.shields.io/github/stars/any86/any-touch?style=social"
                />
            </a>

            <a class="link" target="_new" href="https://github.com/any86/any-touch">文档</a>
            <router-link class="link" to="/topology">SVG</router-link>
            <a class="link" href="https://any86.github.io/photo-touch">canvas</a>
        </header>
        <article ref="panel" class="panel">
            <div
                ref="circle"
                v-for="({top,left,zIndex,scale,angle},index) in styles"
                :style="{top,left,zIndex,transform:`scale(${scale}) rotate(${angle}deg)`}"
                :key="index"
                :index="index"
                @at="onTouch"
                @tap="onTap"
                @at:after="onAfter($event,index)"
                @panstart="onPanstart($event,index)"
                @panmove="onPanmove($event,index)"
                @pandown="onPandown($event,index)"
                @swipe="onSwipe($event,index)"
                @pinch="$event.match() && onPinch($event,index)"
                @rotate="$event.match() && onRotate($event,index)"
                @transitionend="onTransitionend($event,index)"
                :class="['circle']"
            >
                <p style="font-size:16px;border-bottom:1px dashed #fff;">👋可拖拽 / 缩放等...</p>
                <p>Top: {{top}}</p>
                <p>Left: {{left}}</p>
                <p>Scale: {{scale}}</p>
                <p>Angle: {{angle}}</p>
            </div>
        </article>

        <article class="info p-2 mt-6">
            <template v-if="data.type">
                <h1>{{data.type}}</h1>
                <table>
                    <tr align="left">
                        <th>键值</th>
                        <th>值</th>
                        <th>说明</th>
                    </tr>
                    <template v-for="{key,desc} in map">
                        <tr v-if="data[key]" :key="key">
                            <td>{{key}}</td>
                            <td>{{data[key]}}</td>
                            <td>{{desc}}</td>
                        </tr>
                    </template>
                </table>
            </template>

            <div v-else class="info__tip">
                <b class="mb-1">👋 支持:</b>
                <span>tap(点击)</span>
                <span>press(按)</span>
                <span>pan(拖拽)</span>
                <span>swipe(划)</span>
                <span>pinch(捏合)</span>
                <span>rotate(旋转)</span>
            </div>

            <span class="btn-add" @click="add">添加一个(第{{styles.length+1}}个)</span>
        </article>
    </main>
</template>

<script>
/* eslint-disable */
function C(text, bgColor = '#000', color = '#fff') {
    console.log(`%c${text}`, `color:${color};background-color:${bgColor};padding:2px 6px;border-radius:4px;`);
}
import AnyTouch from '../../../packages/any-touch/dist/any-touch.umd';
export default {
    name: 'Home',
    data() {
        return {
            map: [
                { key: 'name', desc: '识别器名' },
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
                { key: 'angle', desc: '一个识别周期rotate的累计选装量' },
            ],
            action: '',
            data: {},
            styles: [
                { left: `50px`, top: `160px`, zIndex: 1, scale: 1, angle: 0 },
                { left: `50px`, top: `320px`, zIndex: 1, scale: 1, angle: 0 },
                { left: `50px`, top: `480px`, zIndex: 1, scale: 1, angle: 0 },
            ],
        };
    },

    mounted() {
        const at = new AnyTouch(this.$refs.panel, { preventDefault: true });
        at.on('at:after', this.afterEach);
        at.on('pan', e=>{
            // console.log('pan')
        });
    },

    methods: {
        add() {
            const style = { left: `50px`, top: `160px`, zIndex: 1, scale: 1, angle: 0 };
            this.styles.push(style);
        },
        onAfter(ev) {
            ev.currentTarget.setAttribute('at', ev.name);
        },
        onTouch(ev) {
            // console.log('html:', ev.target.innerHTML);
            ev.currentTarget.setAttribute('at-phase', ev.phase);
        },
        afterEach(ev) {
            this.action = ev.name;
            this.$set(this, 'data', ev);
        },
        onRotate(ev, index = 0) {
            // if(ev.isMatch() ) return;
            // console.log(`deltaAngle:${ev.deltaAngle}`,ev.phase,ev.pointLength)
            this.styles[index].angle += ev.deltaAngle;
        },

        onPinch(ev, index = 0) {
            // if(ev.isMatch() ) return;

            // console.log(`deltaScale:${ev.deltaScale}`,ev.phase,ev.pointLength)
            this.styles[index].scale = Math.round(this.styles[index].scale * ev.deltaScale * 100) / 100;
        },

        onRotate1(ev, index = 1) {
            // console.log(`deltaAngle:${ev.deltaAngle}`,ev.phase,ev.pointLength)
            this.styles[index].angle += ev.deltaAngle;
        },

        onPinch1(ev, index = 1) {
            // console.log(`deltaScale:${ev.deltaScale}`,ev.phase,ev.pointLength)
            this.styles[index].scale = Math.round(this.styles[index].scale * ev.deltaScale * 100) / 100;
        },

        onTransitionend(ev, index) {},
        
        onTap(ev) {
            C(ev.type, '#f10');
        },

        onPress(ev) {
            C(ev.type, '#710');
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
            // console.log(ev.preventDefault)
            // console.dir(ev.target)
            // console.log(ev.deltaX,ev.deltaY)
            this.styles[index].top = parseInt(this.styles[index].top) + ev.deltaY + 'px';
            this.styles[index].left = parseInt(this.styles[index].left) + ev.deltaX + 'px';
        },

        onPandown(ev, index) {},
    },
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
    position: relative;
    z-index: 1;
    height: 100vh;
    width: 100%;
    header {
        position: fixed;
        display: flex;
        align-items: center;
        padding: 16px;
        background: #fff;
        box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.1);
        width: 100%;
        .link {
            font-size: 16px;
            line-height: 12px;
            color: #69c;
            margin-left: 16px;
            text-decoration: none;
            &+.link{
                border-left:1px solid #ccc;
                padding-left: 16px;
            }
        }
    }

    .panel {
        .circle {
            position: absolute;
            border-radius: 4px;
            color: #fff;
            padding: 16px;
            &:hover {
                cursor: pointer;
            }

            $colors: (
                rgba(226, 47, 47, 0.8),
                rgba(134, 136, 45, 0.8),
                rgba(9, 206, 140, 0.8),
                rgba(123, 44, 1, 0.8),
                rgba(9, 55, 140, 0.8),
                rgba(68, 2, 33, 0.8),
                rgba(1, 206, 2, 0.8),
                rgba(52, 4, 44, 0.8),
                rgba(219, 66, 140, 0.8),
                rgba(66, 66, 1, 0.8)
            );

            @for $i from 1 through 10 {
                &:nth-of-type(10n + #{$i}) {
                    background-color: nth($colors, $i);
                }
            }

            &[at='tap'][at-phase='end'] {
                animation: Tap 200ms;
            }

            &[at='press']:not([at-phase='end']) {
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

    .info {
        box-sizing: border-box;
        min-height: 80vh;

        &__tip {
            color: #000;
            font-size: 16px;
            padding: 16px 24px;
            span {
                &:after {
                    content: ' / ';
                }

                &.active {
                    color: #f10;
                }
            }
        }

        h1 {
            padding: 8px;
        }
        tr {
            td,
            th {
                padding: 6px 8px;
                font-size: 16px;
            }
        }

        .btn-add {
            color: #fff;
            display: inline-block;
            padding: 16px;
            position: fixed;
            background-color: #dc3545;
            border-radius: 999px;
            z-index: 1986;
            left: 50%;
            bottom: 16px;
            transform: translateX(-50%);
            box-shadow: 1px 2px 20px rgba(139, 8, 8, 0.589);
            &:hover {
                cursor: pointer;
            }
            &:active {
                transition: all 500ms;
                background-color: #dc3546a4;
                box-shadow: none;
            }
        }
    }
}
</style>
