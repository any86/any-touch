<template>
    <main>
        <section ref="child">Child</section>
    </main>
</template>

<script>
import AnyTouch from '@any-touch/core';
import Pan from '@any-touch/pan';
AnyTouch.use(Pan);
export default {
    name: 'Map',

    data() {
        return {
          
        };
    },

    mounted(){
        const at = new AnyTouch(this.$refs.child);
        at.on('pan', ev=>{
            console.log(ev)
        })
        
    },

    methods: {
        onPan(ev) {
           
        }
    }
};
</script>

<style scope lang="scss">
section{
    padding:24px;
    width:50%;
    background:#68c;
    color:#fff;
}
</style>
