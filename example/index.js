let log = console.log;
log = () => { };
new Vue({
    el: '#app',

    data() {
        return {
            activeType: 'AnyTouch',
            angle: 0,
            scale: 1,
            x: window.innerWidth / 2 - 100,
            y: window.innerHeight / 2 - 100,
            centerX: 0,
            centerY: 0,
            message: {}
        };
    },
    mounted() {
        const el = this.$refs.circle;
        // 初始化
        const at = new AnyTouch(el);
    },

    watch: {
        message() {
            this.activeType = this.message.type;
        }
    }
});