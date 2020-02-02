<template>
    <main>
        <div
            ref="circle"
            v-for="(style,index) in styles"
            :data-index="index"
            :style="style"
            :key="index"
            @panstart="onPanstart"
            @panmove="onPanmove"
            class="circle"
        ></div>
        <!-- <router-view/> -->
    </main>
</template>

<script>
/* eslint-disable */
import AnyTouch from '../../packages/any-touch/dist/any-touch.umd';
export default {
    data() {
        return {
            styles: [
                { left: `100px`, top: `100px`, zIndex: 1 },
                { left: `200px`, top: `200px`, zIndex: 1 },
                { left: `300px`, top: `300px`, zIndex: 1 }
            ]
        };
    },

    mounted() {
        const at = new AnyTouch(this.$el);
    },

    methods: {
        onPanstart(ev) {
            const { index } = ev.target.dataset;
            for (const i in this.styles) {
                this.styles[i].zIndex = i == index ? 2 : 1;
            }
        },

        onPanmove(ev) {
            const { index } = ev.target.dataset;
            this.styles[index].top = parseInt(this.styles[index].top) + ev.deltaY + 'px';
            this.styles[index].left = parseInt(this.styles[index].left) + ev.deltaX + 'px';
        }
    }
};
</script>

<style lang="scss">
html,
body {
    padding: 0;
    margin: 0;
}
main {
    position: relative;
    background-color: rgb(235, 235, 235);
    height: 100vh;
    width: 100%;
    .circle {
        position: absolute;
        background-image: url('./assets/a.jpg');
        background-size: 100%;
        width: 100px;
        height: 100px;
        border-radius: 100%;
    }
}

// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
// }
</style>
