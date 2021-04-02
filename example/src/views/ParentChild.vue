<template>
    <main class="ovh">
        <div ref="t1" id="parent1111" class="p-6 bg-success">target_1
        <div ref="t2" id="child22222" class="p-6 bg-info">target_2</div>

        </div>
    </main>
</template>

<script>
import AnyTouch from '../../../packages/any-touch/dist/any-touch.umd';
console.dir(AnyTouch)
export default {
    name: 'ParentChild',
    data() {
        return {};
    },

    mounted() {
        const at2 = new AnyTouch(this.$refs.t2);
        const at1 = new AnyTouch(this.$refs.t1);


         at2.on('panstart', e=>{
            console.log(2);
        })
        at1.on('panstart', e=>{
            console.log(1);
        })
    },
};
</script>

<style lang="scss">
</style>
