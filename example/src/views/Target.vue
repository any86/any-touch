<template>
    <main class="ovh">
        <div ref="t1" class="p-6 bg-success">target_1</div>
        <div ref="t2" class="p-6 bg-info">target_2</div>
    </main>
</template>

<script>
import AnyTouch from '../../../packages/any-touch/dist/any-touch.umd';
export default {
    name: 'Target',
    data() {
        return {};
    },

    mounted() {
        const at = new AnyTouch(this.$el, { isPreventDefault: true });
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
