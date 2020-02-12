<template>
    <main>
        <header>
            <a target="_new" href="https://github.com/any86/any-touch">
                <img
                    width="100"
                    src="https://img.shields.io/github/stars/any86/any-touch?style=social"
                />
            </a>
            <!-- {{mapImg}} -->
            <a class="link" target="_new" href="https://github.com/any86/any-touch">文档</a>
            <button @click="zoomOut">缩小</button>
            <button @click="zoomIn">放大</button>

            <button @click="setOrg(100,100)">100,100</button>
            <button @click="setOrg(200,200)">200,200</button>

            <!-- <a class="link" target="_new" :href="`?a=${Date.now()}`">刷新</a> -->
        </header>
        <article ref="map" class="map">
            {{mapImg}}
            <img
                ref="mapImg"
                v-if="mapImg.url"
                @panmove="onMapPan"
                @tap="onMapTap"
                @wheel="onMapWheel"
                @pinchstart="onMapPinchstart"
                :style="{
                    left:`${mapImg.left}px`,
                    top:`${mapImg.top}px`, 
                    transform: `scale(${mapImg.scale})`,
                    transformOrigin:`${mapImg.orgX}px ${mapImg.orgY}px`
                }"
                :src="mapImg.url"
                alt="地图"
            />
            <div
                ref="mapDot"
                v-for="({xInMap,yInMap,zIndex,scale},index) in mapDots"
                :style="{
                    top:`${yInMap*mapImg.scale+mapImg.top+mapImg.orgY*(1-mapImg.scale)}px`,
                    left:`${xInMap*mapImg.scale+mapImg.left+mapImg.orgX*(1-mapImg.scale)}px`,
                    zIndex,
                    transform:`translate(-50%,-50%)`}"
                :key="index"
                @pan="onDotPan($event,index)"
                @tap="onDotTap($event,index)"
                @transitionend="onTransitionend($event,index)"
                :class="['map__dot']"
            >{{xInMap}} - {{yInMap}}</div>
        </article>

        <!-- <p class="tip">
            👋 支持6类手势:
            <span>tap(点击)</span>
            <span>press(按)</span>
            <span>pan(拖拽)</span>
            <span>swipe(划)</span>
            <span>pinch(捏合)</span>
            <span>rotate(旋转)</span>
        </p>-->
        <!-- <span class="btn-add" @click="add">添加一个(第{{mapDots.length+1}}个)</span> -->
        <label ref="btn" class="btn-add">
            上传
            <input @change="onChangeFile" type="file" />
        </label>
    </main>
</template>

<script>
/* eslint-disable */
function C(text, bgColor = '#000', color = '#fff') {
    console.log(`%c${text}`, `color:${color};background-color:${bgColor};padding:2px 6px;border-radius:4px;`);
}
// import VConsole from 'vconsole';
// new VConsole();
import AnyTouch from '../../../packages/any-touch/dist/any-touch.umd';
import axios from 'axios';
export default {
    name: 'Map',

    data() {
        return {
            data: {},
            map: { top: 0, left: 0 },
            deltaOrgX: 0,
            deltaOrgY: 0,
            mapImg: {
                orgX: 0,
                orgY: 0,
                width: 0,
                height: 0,
                url: '',
                left: 0,
                top: 0,
                scale: 1
            },
            mapDots: []
        };
    },

    computed: {
        scale() {
            return this.mapImg.scale;
        },

        orgX() {
            return this.mapImg.orgX;
        },

        orgY() {
            return this.mapImg.orgY;
        }
    },

    mounted() {
        const at = new AnyTouch(this.$refs.map);
        const { x, y } = this.$refs.map.getBoundingClientRect();
        this.map.top = Math.round(y);
        this.map.left = Math.round(x);
    },

    methods: {
        onMapPinchstart(ev){
            this.changeOrgXY(ev);
        },
        onMapWheel(ev) {
            const { clientX, clientY, deltaY } = ev;
            // this.mapImg.orgX
            this.changeOrgXY({ x: clientX, y: clientY });
            this.mapImg.scale *= 1 + deltaY / 100;
        },
        async onChangeFile(ev) {
            const files = Array.from(ev.target.files);
            let formData = new FormData();
            formData.append('name', 'xyzabc');
            formData.append('file', files[0]);
            const res = await axios.post('http://127.0.0.1:3000/upload', formData, {
                'Content-Type': 'multipart/form-data'
            });

            this.mapImg.url = URL.createObjectURL(files[0]);
            await this.$nextTick();
            this.$refs.mapImg.onload = (ev) => {
                this.mapImg.width = ev.target.width;
                this.mapImg.height = ev.target.height;
            };
        },

        zoomOut() {
            // console.dir(this.$refs.mapImg.offsetTop)
            // this.mapImg.left = this.$refs.mapImg.offseLeft;
            // this.mapImg.top = this.$refs.mapImg.offsetTop;
            this.mapImg.scale -= 0.1;
            // this.mapImg.left += this.mapImg.width - this.mapImg.orgX;
            // this.mapImg.top += this.mapImg.height - this.mapImg.orgY;
        },

        zoomIn() {
            this.mapImg.scale += 0.1;
        },

        onMapPan({ deltaX, deltaY }) {
            this.mapImg.left += deltaX;
            this.mapImg.top += deltaY;
        },

        getMapImgOffset() {
            const { x, y } = this.$refs.mapImg.getBoundingClientRect();
            // this.mapImg.offsetX = Math.round(x);
            // this.mapImg.offsetY = Math.round(y);
            return { x: Math.round(x), y: Math.round(y) };
        },

        /**
         * 增加一个坐标
         */
        onMapTap({ x, y }) {
            const rect = this.getMapImgOffset();
            const offsetMapX = x - rect.x;
            const offsetMapY = y - rect.y;
            const xInMap = Math.round(offsetMapX / this.mapImg.scale);
            const yInMap = Math.round(offsetMapY / this.mapImg.scale);
            // this.mapImg.orgPoint = {x:xInMap,y:yInMap};
            // this.mapImg.orgPoint = {x:100,y:100};

            this.mapDots.push({
                xInMap,
                yInMap,
                zIndex: 1,
                scale: 1,
                angle: 0
            });
        },

        /**
         * 拖拽点
         */
        onDotPan({ deltaX, deltaY }, index) {
            this.mapDots[index].xInMap += Math.round(deltaX / this.scale);
            this.mapDots[index].yInMap += Math.round(deltaY / this.scale);
        },

        changeOrgXY({ x, y }) {
            const rect = this.getMapImgOffset();
            const offsetMapX = x - rect.x;
            const offsetMapY = y - rect.y;
            const xInMap = Math.round(offsetMapX / this.mapImg.scale);
            const yInMap = Math.round(offsetMapY / this.mapImg.scale);
            this.setOrg(xInMap, yInMap);
        },

        onDotTap(ev){
            this.changeOrgXY(ev)
        },

        setOrg(x, y) {
            this.deltaOrgX = x - this.mapImg.orgX;
            this.deltaOrgY = y - this.mapImg.orgY;
            this.mapImg.orgX = x;
            this.mapImg.orgY = y;
            this.mapImg.left -= this.deltaOrgX * (1 - this.scale);
            this.mapImg.top -= this.deltaOrgY * (1 - this.scale);
        }
    }
};
</script>

<style lang="scss">
@mixin bgChessboard($color: #aaa) {
    background-image: linear-gradient(45deg, $color 25%, transparent 25%, transparent 75%, $color 75%, $color),
        linear-gradient(45deg, $color 26%, transparent 26%, transparent 74%, $color 74%, $color);
    background-size: 100px 100px;
    background-position: 0 0, 50px 50px;
}
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
// .map__dot[at^='pan'] {
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
    padding: 16px;
    > header {
        display: flex;
        align-items: center;
        padding: 28px;
        .link {
            font-size: 16px;
            line-height: 12px;
            color: #69c;
            margin-left: 16px;
            text-decoration: none;
        }
    }

    > .map {
        position: relative;
        // background-color: #fff;
        @include bgChessboard(#999);
        width: 90%;
        height: 500px;
        overflow: hidden;
        > img {
            position: absolute;
            transform-origin: 0 0;
            // width: 100%;
        }

        > .map__dot {
            position: absolute;
            width: 48px;
            height: 48px;
            border-radius: 4px;
            background-color: rgba(#000, 0.6);
            color: rgba(#fff, 0.7);
            &:hover {
                cursor: pointer;
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
    .btn-add {
        color: #fff;
        padding: 16px;
        position: absolute;
        background-color: #69c;
        border-radius: 4px;
        z-index: 1986;
        right: 16px;
        bottom: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        &:hover {
            cursor: pointer;
        }
    }

    button {
        padding: 16px;
    }
}
</style>
