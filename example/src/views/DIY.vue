<template>
    <article class="p-2">
        <ButtonLoadFile class="a-button a-button--primary" @loaded="onImageLoaded"></ButtonLoadFile>
        <Crop
            ref="crop"
            :width="width"
            :height="height"
            :img="img"
            :point.sync="point"
            :offset.sync="offset"
            :org="org"
            :scale="scale"
            :angle="angle"
            class="mt-2"
            style="border:1px solid #69c;"
        />
        <hr class="mt-2" />
        <label class="a-input">
            <input v-model.number="point[0]" type="range" />
            图片顶点X: {{point[0]}}
        </label>
        <label class="a-input">
            <input v-model.number="point[1]" type="range" />
            图片顶点Y: {{point[1]}}
        </label>
        <hr class="mt-2" />
        <!-- Offset -->
        <label class="a-input">
            <input v-model.number="offset[0]" type="range" />
            OffsetX: {{offset[0]}}
        </label>
        <label class="a-input">
            <input v-model.number="offset[1]" type="range" />
            OffsetY: {{offset[1]}}
        </label>
        <hr class="mt-2" />

        <label class="a-input">
            <input v-model.number="org[0]" type="range" />
            OX:{{org[0]}}
        </label>
        <label class="a-input">
            <input v-model.number="org[1]" type="range" />
            OY:{{org[1]}}
        </label>

        <label class="a-input">
            <input v-model.number="scale" min="0.1" max="2" step="0.1" type="range" />
            Scale: {{scale}}
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
        return {
            context: null,
            img: null,
            org: [150, 150],
            angle: 0,
            point: [0, 0],
            scale: 1,
            offset: [0, 0],
            width: 750,
            height: 750
        };
    },

    computed: {
        moveRate() {
            return this.$refs.crop.$el?.offsetWidth / this.width;
        }
    },

    methods: {
        onPanmove({ deltaX, deltaY }) {
            const [offsetX, offsetY] = this.offset;
            this.offset = [offsetX + deltaX / this.moveRate, offsetY + deltaY / this.moveRate];
        },

        onRotatemove({ deltaAngle }) {
            this.angle += deltaAngle;
        },

        onPinchmove({ deltaScale }) {
            this.scale = Math.round(this.scale * deltaScale * 100) / 100;
        },

        onImageLoaded(e) {
            const { img } = e[0].source;
            this.img = img;
            // const rect = this.getCenterRect(img.width, img.height,this.width,this.height);
        },

        changeOrg({ x, y }) {
            const rect = this.$refs.crop.$el.getBoundingClientRect();
            const pointInEl = [(x - rect.left) / this.moveRate, (y - rect.top) / this.moveRate];
            this.org = pointInEl;
        }
    },

    mounted() {
        const at = new AnyTouch(this.$refs.crop.$el);
        at.on('panmove', this.onPanmove.bind(this));
        at.on('pinchstart', this.changeOrg.bind(this));
        at.on('rotatestart', this.changeOrg.bind(this));
        at.on('pinchmove', this.onPinchmove.bind(this));
        at.on('rotatemove', this.onRotatemove.bind(this));
        at.on('tap', this.changeOrg.bind(this));
    }
};
</script>

<style scope lang="scss">
label {
    display: block;
}
</style>