<template>
    <canvas :width="width" :height="height"></canvas>
</template>

<script>
import loadImage from './loadImage';
export default {
    name: 'Crop',

    props: {
        width: {
            type: Number,
            default: 300
        },
        height: {
            type: Number,
            default: 300
        },
        img: {
            type: Image
        },

        scale: {
            type: Number,
            default: 1
        },

        org: {
            type: Array,
            default: () => [0, 0]
        },

        angle: {
            type: Number,
            default: 0
        },

        // 元素坐标系上的点
        point: {
            type: Array,
            default: () => [0, 0]
        },

        // 平移距离
        offset: {
            type: Array,
            default: () => [0, 0]
        }
    },

    data() {
        return {
            context: null,
            // 图片左上角在canvas坐标系中的坐标
            imageApexPointInCanvas: null,
            offsetInCanvas:null,
        };
    },

    computed: {
        rad() {
            return (this.angle * Math.PI) / 180;
        }
    },

    watch: {
        img() {
            this.render();
        },

        offset: {
            deep: true,
            handler() {
                this.offsetInCanvas = this.swtichCoordinateToCanvas(this.offset);
                this.render();
            }
        },

        scale(){
            this.render();
        },

        org() {
            // 元素坐标系中的点在canvas坐标系中的坐标
            this.imageApexPointInCanvas = this.getPositionInCanvas(this.point);
            this.render();
        },

        angle(angle) {
            this.render();
        }
    },

    mounted() {
        this.context = this.$el.getContext('2d');
        this.imageApexPointInCanvas = this.getPositionInCanvas(this.point);
        this.offsetInCanvas = this.swtichCoordinateToCanvas(this.offset);
        this.$nextTick(() => {
            this.render();
        });
    },

    methods: {
        /**
         * 元素坐标系下的坐标转换到canvas坐标系
         */
        swtichCoordinateToCanvas([x, y]) {
            const {rad} = this;
            return [
                (Math.cos(rad) * x + Math.sin(rad) * y) / this.scale,
                (-Math.sin(rad) * x + Math.cos(rad) * y) / this.scale
            ];
        },
        /**
         * canvas坐标系坐标转到标准坐标系下
         */
        switchCoordinateToStandard([x, y]) {
            const {rad} = this;
            return [
                (Math.cos(rad) * x - Math.sin(rad) * y) * this.scale,
                (Math.sin(rad) * x + Math.cos(rad) * y) * this.scale
            ];
        },
        /**
         * 元素坐标系中的点在canvas坐标系中的坐标
         * @param {Array} 元素坐标系中的点
         */
        getPositionInCanvas([x, y]) {
            // 计算平移
            const dx = x - this.org[0];
            const dy = y - this.org[1];
            // 计算旋转/缩放
            return this.swtichCoordinateToCanvas([dx, dy]);
        },

        render() {
            if (!this.img) return;

            const { context } = this;
            // 初始值
            const {rad} = this;
            context.clearRect(0, 0, this.width, this.height);
            this.drawChessboard();

            context.save();
            context.translate(this.org[0], this.org[1]);
            context.scale(this.scale, this.scale);
            context.rotate(rad);
            // 图片左上角在canvas坐标系中的坐标
            // 只有变化坐标系原点的时候(org)才会发生imageApexPoint变化
            const [x, y] = this.imageApexPointInCanvas;

            // 求图片左上角在元素坐标系中的新坐标
            // 每次旋转/缩放计算新坐标
            const _point = this.switchCoordinateToStandard(this.imageApexPointInCanvas);
            const newPoint = [
                this.org[0] + _point[0],
                this.org[1] + _point[1]
            ];
            this.$emit('update:point', newPoint);
            // 把外部的偏移变成变化坐标系的xy变化
            context.fillRect(this.offsetInCanvas[0] + x, this.offsetInCanvas[1] + y, 100, 100);
            // context.drawImage(this.img, 0, 0,this.img.width,this.img.height,this.offsetInCanvas[0] + x, this.offsetInCanvas[1] + y,this.img.width,this.img.height);
            context.fillStyle = '#d10';
            context.fillRect(-10/this.scale, -10/this.scale, 20/this.scale, 20/this.scale);

            context.restore();
        },




        drawRect() {
            const { width, height } = this.img;
            this.context.save();
            this.context.fillStyle = 'rgba(0,0,0,0.6)';
            this.context.fillRect(0, 0, width, height);
            this.context.restore();
        },

        drawNineGrid(startX, startY, viewWidth, viewHeight) {
            const context = this.context;
            const max = 3;
            const each = [viewWidth / max, viewHeight / max];
            context.save();
            context.strokeStyle = '#fff';

            for (let i = 0; i <= max; i++) {
                // Y轴
                const x = each[0] * i;
                context.moveTo(startX + x, startY);
                context.lineTo(startX + x, startY + viewHeight);

                // X轴
                const y = each[1] * i;
                context.moveTo(startX, startY + y);
                context.lineTo(startX + viewWidth, startY + y);
            }
            context.stroke();
            context.restore();
        },

        /**
         * 棋盘
         */

        drawChessboard() {
            const context = this.context;
            const size = 10;
            const count = [this.width / size, this.height / size];
            const colorReverse = { '#fff': '#ddd', '#ddd': '#fff' };
            context.save();
            let color = '#ddd';
            let rowStartColor = color;
            for (let i = 0; i <= count[0]; i++) {
                for (let j = 0; j < count[1]; j++) {
                    context.fillStyle = color;
                    const x = 0 + size * i;
                    const y = 0 + size * j;
                    context.fillRect(x, y, size, size);
                    color = colorReverse[color];
                }
                rowStartColor = colorReverse[rowStartColor];
                color = rowStartColor;
            }
            context.stroke();
            context.restore();
        },

        drawChessboard1() {
            const context = this.context;
            const count = [40, Math.ceil((40 * this.height) / this.width)];
            const size = this.width / count[0];
            const colorReverse = { '#fff': '#ddd', '#ddd': '#fff' };
            context.save();
            let color = '#ddd';
            let rowStartColor = color;
            for (let i = 0; i <= count[0]; i++) {
                for (let j = 0; j < count[1]; j++) {
                    context.fillStyle = color;
                    const x = 0 + size * i;
                    const y = 0 + size * j;
                    context.fillRect(x, y, size, size);
                    color = colorReverse[color];
                }
                rowStartColor = colorReverse[rowStartColor];
                color = rowStartColor;
            }
            context.stroke();
            context.restore();
        }
    }
};
</script>

<style scope lang="scss">
.crop-panel {
    width: 100%;
    display: block;
    margin: auto;
}
</style>