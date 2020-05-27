<template>
    <ul class="scroll-view">
        <li
            class="scroll-view__item"
            :class="{'scroll-view__item--drag':activeIndex===index}"
            v-for="(n,index) in 10"
            :key="n"
            @press="onPress(index)"
            @pressup="onPressup"
        >
            <div class="text-block">Slide {{n}}</div>
        </li>
    </ul>
</template>

<script>
import Swiper from 'swiper';
import 'swiper/css/swiper.css';
import { Sortable } from 'sortablejs';
import AnyTouch from '../../../packages/any-touch/dist/any-touch.umd';
export default {
    name: 'Map',

    data() {
        return { activeIndex: -1, sortable: null };
    },

    mounted() {
        const at = new AnyTouch(this.$el, { isPreventDefault: false });
        this.sortable = new Sortable(this.$el, {
            delay: 200,
            touchStartThreshold: 3,
            onChoose(e) {
                console.log(e);
            },
            animation: 300,
            disabled: !true,
            scroll: true, // Enable the plugin. Can be HTMLElement.
            scrollSensitivity: 50, // px, how near the mouse must be to an edge to start scrolling.
            scrollSpeed: 10, // px, speed of the scrolling
            bubbleScroll: true // apply autoscroll to all parent elements, allowing for easier movement
        });
    },
    methods: {
        onPress(index) {
            this.activeIndex = index;
            // this.sortable.option('disabled', true);
        },

        onPressup() {
            this.activeIndex = -1;
            // this.sortable.option('disabled', false);
        }
    }
};
</script>

<style scope lang="scss">
.sortable-ghost {
    opacity: 0.6;
    border: 1px dashed red;
    box-sizing: border-box;
}
.sortable-drag {
    box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.2);
}

.text-block {
    background-color: #ccc;
    width: 100px;
    text-align: center;
    height: 100px;
    line-height: 100px;


}

.scroll-view {
    width: 100%;
    overflow-x: auto;
    display: flex;
    -webkit-overflow-scrolling: touch;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    &__item {
        flex-shrink: 0;
        flex-grow: 0;
        list-style: none;
        &--drag{
            border: 1px dashed red;
        }
    }
}
</style>