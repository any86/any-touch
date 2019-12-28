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
        function C(ev, bgColor = "#f10", color = "#fff") {
            console.log(`%c${ev.type}`, `color:${color};background-color:${bgColor};padding:4px;`, ev)
        }
        const el = this.$refs.circle;
        // 初始化
        const at = new AnyTouch(el);
        at.on('input', ev => {
            // console.log(ev);
        })

        at.on('pinch', ev => {
            C(ev, '#f99');
        });

        at.on('tap', ev => {
            C(ev, '#f10');
        });

        at.on('swipe', ev => {
            C(ev, '#680');
        });

        at.on('pan', ev => {
            this.x += ev.deltaX;
            this.y += ev.deltaY;
            C(ev, '#968');
        })


        at.on('pinch', ev => {
            this.scale*= ev.deltaScale;
        });


        at.on('rotate', ev => {
            this.angle+= ev.deltaAngle;
        });

    },

    watch: {
        message() {
            this.activeType = this.message.type;
        }
    }
});