<template>
    <label class="button-load-file">
        <input type="file" accept="image/*" multiple @change="onChange" />
        <slot>Upload</slot>
    </label>
</template>

<script>
// 114 72
import AnyTouch from '../../../packages/any-touch/dist/any-touch.umd';
import loadImage from './loadImage';
export default {
    name: 'ButtonLoadFile',

    props: {
        cropSize: {
            type: Array,
            default: () => [426, 269]
        }
    },

    computed: {
        // 目标裁剪比例
        cropRate() {
            return this.cropSize[0] / this.cropSize[1];
        }
    },

    data() {
        return { url: '' };
    },

    methods: {
        readFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async (e) => {
                    const img = await loadImage(e.target.result);
                    const { width, height } = img;
                    const crop = this.crop(img);
                    resolve({ source: { url: e.target.result, img, width, height }, crop });
                };

                reader.onerror = reject;
            });
        },

        async onChange(e) {
            const { target } = e;
            const { files } = target;
            const array = Array.from(files);
            if (0 < array.length) {
                const data = await Promise.all(array.map(async (file) => this.readFile(file)));
                this.$emit('loaded', data);
            } else {
                this.$emit('reset');
            }
        },

        crop(img) {
            const el = document.createElement('canvas');
            const context = el.getContext('2d');
            const { width, height } = img;

            const rate = width / height;
            // 从元素选取的起点和宽高
            let sourceWidth = width;
            let sourceHeight = height;
            let sourceY = 0;
            let sourceX = 0;
            let cropAxis = 'x';
            // 以宽度为基准, 裁剪高度
            if (this.cropRate > rate) {
                cropAxis = 'y';
                sourceHeight = sourceWidth / this.cropRate;
                sourceY = (height - sourceHeight) / 2;
            }
            // 以高度为基准, 裁剪宽度
            else {
                sourceWidth = sourceHeight * this.cropRate;
                sourceX = (width - sourceWidth) / 2;
            }
            // console.clear();
            // console.log({ sourceX, sourceY, sourceWidth, sourceHeight }, width, height);
            el.width = this.cropSize[0];
            el.height = this.cropSize[1];
            const args = [img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, this.cropSize[0], this.cropSize[1]];
            context.drawImage(...args);
            const url = el.toDataURL();
            return {
                url,
                x: sourceX,
                y: sourceY,
                width: sourceWidth,
                height: sourceHeight,
                cropAxis,
                cropRate: this.cropRate,
                args
            };
            // console.log(dataURL);
        }
    }
};
</script>

<style scope lang="scss">
.button-load-file {
    padding: 16px 0;
    width: 100%;
    height: 100%;
    text-align: center;
    box-sizing: border-box;
    background: rgb(15, 147, 208);
    color: #fff;
    display: inline-block;
    &:hover {
        cursor: pointer;
    }
    > input[type='file'] {
        display: none;
    }
}
</style>