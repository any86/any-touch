<template>
    <main class="ovh">
        <div ref="tap" class="p-6 bg-success">Tap</div>
    </main>
</template>

<script>
import AnyTouch from '../../../packages/any-touch/dist/any-touch.umd';
export default {
    name: 'UseR',
    data() {
        return {};
    },

    mounted() {
        const {Tap} = AnyTouch;
        AnyTouch.use(Tap,{name:'twoFingersTap',tapTimes:2,pointLength:2,maxDistanceFromPrevTap:100});
        const at = new AnyTouch(this.$el, { preventDefault: true });

        at.target(this.$refs.tap).on('tap', (e) => {
            console.log(e.type);
        });

    },
};
</script>

<style lang="scss">
</style>
