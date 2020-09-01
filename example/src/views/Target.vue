<template>
    <main class="ovh">
        <div ref="t1" class="p-6 bg-success">target_1</div>
        <div ref="t2" class="p-6 bg-info">target_2</div>
    </main>
</template>

<script>
import AnyTouch from '../../../packages/any-touch/dist/any-touch.umd';
console.dir(AnyTouch)
export default {
    name: 'Target',
    data() {
        return {};
    },

    mounted() {
        const {Tap} = AnyTouch;
        AnyTouch.use(Tap,{name:'twoFingersTap',tapTimes:2,pointLength:2,maxDistanceFromPrevTap:100});
        const at = new AnyTouch(this.$el, { isPreventDefault: true });

        at.on('twoFingersTap', e=>{
            console.warn(e.type)
        })
        at.target(this.$refs.t1).on('tap', (e) => {
            console.log(e.type);
        });

        at.target(this.$refs.t2).on('pan', (e) => {
            console.log(e.type);
        });
    },
};
</script>

<style lang="scss">
</style>
