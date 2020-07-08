<template>
    <article class="p-2">
        <ButtonLoadFile class="a-button a-button--primary" @loaded="onImageLoaded"></ButtonLoadFile>
        <Crop :img="img" :point.sync="point" :org="org" :angle="angle" style="border:2px solid #643;"/>
        <hr>
        <label class="a-input">
            <input v-model.number="point[0]" type="range" />
            SX:{{point[0]}}
        </label>
        <label class="a-input">
            <input v-model.number="point[1]" type="range" />
            SY:{{point[1]}}
        </label>
        <label class="a-input">
            <input v-model.number="org[0]" type="range" />
            OX:{{org[0]}}
        </label>
        <label class="a-input">
            <input v-model.number="org[1]" type="range" />
            OY:{{org[1]}}
        </label>
        <label class="a-input">
            <input v-model.number="angle" type="range" max="360" />
            A:{{angle}}
        </label>
    </article>
</template>

<script>
import AnyTouch from '../../../packages/any-touch/dist/any-touch.umd';
import ButtonLoadFile from './ButtonLoadFile';
import Crop from './Crop';

export default {
    name: 'DIY',

    components: { ButtonLoadFile, Crop },

    data() {
        return { context: null, img: null, org: [0, 0],angle:0 ,point:[0,0]};
    },

    methods: {
        onImageLoaded(e) {
            const { img } = e[0].source;
            this.img = img;
        }
    }
};
</script>

<style scope lang="scss">
label{display: block;}
</style>