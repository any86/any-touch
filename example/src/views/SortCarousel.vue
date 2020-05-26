<template>
    <section class="carousel" :style="{height:`${height}px`}">
        <ul class="carousel__body" :style="{transform:`translateX(${translateX}px)`}">
            <li
                :draggable="'sort' === action"
                class="carousel__body__item"
                :action="index == activeIndex? action: void 0"
                v-for="(n,index) in 10"
                :key="n"
                @press="onPress(index, $event)"
                @pressup="onPressup"
                @panmove="onPanmove(index,$event)"
            >
                <div class="test-block">{{index}} - {{action}}</div>
            </li>
        </ul>
    </section>
</template>

<script>
import AnyTouch from '../../../packages/any-touch/dist/any-touch.umd';
export default {
    name: 'SortCarousel',

    props: {
        height: {
            type: Number,
            default: 300
        }
    },

    data() {
        return {
            translateX: 0,
            action: '',
            activeIndex: -1
        };
    },

    mounted() {
        const at = new AnyTouch(this.$el);
        this.$on('destroyed', () => {
            at.destroy();
        });
    },
    methods: {
        onPanmove(index, e) {
            if ('' === this.action) {
                this.translateX += e.deltaX;
            } else if ('sort' === this.action) {

            }
        },

        onPress(index,e) {
            this.action = 'sort';
            this.activeIndex = index;
            console.warn('press');
        },

        onPressup() {
            this.action = '';
            this.activeIndex = -1;
            console.warn('pressup');
        },

        cloneItem(){
            
        }
    }
};
</script>

<style scope lang="scss">
.carousel {
    position: relative;
    &__body {
        position: absolute;
        display: flex;
        &__item {
            list-style: none;

            &:hover {
                cursor: pointer;
            }

            &[action='sort'] {
                transition: all 200ms;
                opacity: 0.3;
                transform: scale(0.96);
            }
        }
    }
}

.test-block {
    width: 200px;
    height: 100px;
    line-height: 100px;
    background-color: #555;
    color: #fff;
    font-size: 25px;
    text-align: center;
    margin-right: 16px;
}
</style>