<template>
    <canvas :width="width" :height="height"></canvas>
</template>

<script>
import AnyTouch from '../../../packages/any-touch/dist/any-touch.umd';
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

        point: {
            type: Array,
            default: () => [0, 0]
        }
    },

    data() {
        return {
            context: null,
            newPoint: null,
            offsetX: 0,
            offsetY: 0,
            deltaOrg: [0, 0],
            lastOrg: [...this.org]
        };
    },

    computed: {
        moveRate() {
            return this.$el?.offsetWidth / this.width;
        },

        _transfrom() {
            const { scale, org, angle, point } = this;
            return { scale, org, angle, point };
        }
    },

    watch: {
        img() {
            this.render();
        },

        // point() {
        //     this.newPoint = this.swtichCoordinate(this.point);
        //     this.render();
        // },

        org() {
            this.newPoint = this.swtichCoordinate(this.point);
            this.render();
        },

        angle(angle) {
            this.render();
        }
    },

    mounted() {
        new AnyTouch(this.$el);
        this.context = this.$el.getContext('2d');
        this.newPoint = this.swtichCoordinate(this.point);
        this.$nextTick(() => {
            this.render();
        });
    },

    methods: {
        swtichCoordinate1() {
            return [this.org[0] - x, this.org[1] - y];
        },

        swtichCoordinate(point) {
            const [x, y] = point;
            const rad = (this.angle * Math.PI) / 180;
            return [
                (Math.cos(rad) * (x - this.org[0]) + Math.sin(rad) * (y - this.org[1])) / this.scale,
                (-Math.sin(rad) * (x - this.org[0]) + Math.cos(rad) * (y - this.org[1])) / this.scale
            ];
        },

        render() {
            if (!this.img) return;
            const { context } = this;
            // 初始值
            const rad = (this.angle * Math.PI) / 180;
            context.clearRect(0, 0, this.width, this.height);
            context.save();
            context.translate(this.org[0], this.org[1]);
            context.scale(this.scale, this.scale);
            context.rotate(rad);
            const [x, y] = this.newPoint;
            const newPoint = [
                this.org[0] + Math.cos(rad) * x - Math.sin(rad) * y,
                this.org[1] + Math.sin(rad) * x + Math.cos(rad) * y
            ];
            this.$emit('update:point', newPoint);
            context.fillRect(x, y, 100, 100);
            // context.drawImage(this.img, 0, 0,this.img.width,this.img.height,x,y,this.img.width,this.img.height,);
            context.fillStyle = '#d10';
            context.fillRect(-10, -10, 20, 20);

            context.restore();
        },

        changeAngle() {},

        onPanmove({ deltaX, deltaY }) {
            const dx = deltaX / this.moveRate / this.scale;
            const dy = deltaY / this.moveRate / this.scale;
            const rad = (this.angle * Math.PI) / 180;
            if (0 === rad % Math.PI) {
                this.offsetX += dx;
                this.offsetY += dy;
            } else {
                this.offsetX += Math.cos(rad) * dx + Math.sin(rad) * dy;
                this.offsetY += -Math.sin(rad) * dx + Math.cos(rad) * dy;
            }

            this.render();
        },

        getPeak() {},

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