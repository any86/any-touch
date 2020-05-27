<template>
    <section class="carousel" :style="{height:`${height}px`}">
        <ul
            ref="body"
            class="carousel__body"
            @panmove="onPanmove"
            :style="{transform:`translateX(${translateX}px)`}"
        >
            <li
                ref="item"
                class="carousel__body__item"
                :class="{'carousel__body__item--cloned':isClonedItem(index)}"
                :style="[isClonedItem(index)?{
                    transform: `translateX(${pressItemX + pressMoveX}px)`
                }:void 0]"
                :action="index == activeIndex? action: void 0"
                v-for="({name},index) in list"
                :key="name+index"
                @press="onPress(index, $event)"
                @pressup="onPressup"
            >
                <div class="test-block">{{name}}</div>
            </li>
        </ul>
        <h1
            style="position:absolute;top:0;left:0;z-index:2;color:#fff;"
        >@{{action}} - {{pressMoveX}}</h1>
    </section>
</template>

<script>
import AnyTouch from '../../../packages/any-touch/dist/any-touch.umd';
import cloneDeep from 'lodash/cloneDeep';
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
            list: [{ name: '苹果' }, { name: '笔记本' }, { name: '蔬菜' }, { name: '高楼大厦' }, { name: '铁皮' }],
            translateX: 0,
            action: '',
            activeIndex: -1,
            elCloned: null,
            pressMoveX: 0,
            pressItemX: 0
        };
    },

    computed: {
        offsetLefts() {
            return this.$refs.item.map((el) => el.offsetLeft);
        },
        clonedLeft() {
            return this.offsetLefts[this.activeIndex];
            // :style="{left:offsetLefts[activeIndex]+'px'}"
        }
    },

    mounted() {
        const at = new AnyTouch(this.$el);
        this.$on('destroyed', () => {
            at.destroy();
        });
    },
    methods: {
        isClonedItem(index) {
            return 'sort' === this.action && index == this.list.length - 1;
        },

        onPanmove(e) {
            console.warn('panmove')
            const { left, top } = this.$refs.body.getBoundingClientRect();
            const x = e.x - left;
            const y = e.y - top;

            const onItemIndex = this.offsetLefts.findIndex((n) => n > x) - 1;
            if (onItemIndex !== this.activeIndex) {
                const a = cloneDeep(this.list[this.activeIndex]);
                const b = cloneDeep(this.list[onItemIndex]);
                console.warn(a,b)
                this.list.splice(this.activeIndex, 1, b);
                this.list.splice(onItemIndex, 1, a);
                // this.activeIndex = onItemIndex;
            }
            console.log(onItemIndex, this.activeIndex);
            if ('' === this.action) {
                this.translateX += e.deltaX;
            } else if ('sort' === this.action) {
                this.pressMoveX += e.deltaX;
            }
        },

        onPress(index, e) {
            this.cloneItem(index);
            this.action = 'sort';
            this.activeIndex = index;
            this.pressMoveX = 0;
            this.pressItemX = this.offsetLefts[index];
            console.warn('press');
        },

        onPressup() {
            this.action = '';
            this.activeIndex = -1;
            this.removeItemCloned();
            console.warn('pressup');
        },

        cloneItem(index) {
            const active = this.list[index];
            this.list.push(active);
        },

        removeItemCloned() {
            this.list.pop();
        },

        onTouchmove(index, e) {}
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
                opacity: 0.3;
                transform: scale(0.96);
            }

            &--cloned {
                // pointer-events: none;
                position: absolute;
                opacity: 0.7;
                top: 0;
                border-radius: 9999px;
                .test-block {
                    background-color: rgba(0, 0, 0, 0.9);
                }
            }
        }
    }
}

.test-block {
    width: 150px;
    height: 100px;
    line-height: 100px;
    color: #fff;
    font-size: 25px;
    text-align: center;
    margin-right: 16px;
    background-color: rgb(186, 72, 72);
}
</style>