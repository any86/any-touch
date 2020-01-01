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
            transitionDuration: 0,
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
            this.scale = 0.8;
            setTimeout(() => {
                this.scale = 1;
            }, 100)
            C(ev, '#f10');
        });

        at.on('swipe', ev => {
            this.transitionDuration = 200;
            this.x += ev.speedX * 50;
            this.y += ev.speedY * 50;
            C(ev, '#680');
        });

        at.on('swipeleft', ev => {
            C(ev, '#111');
        });

        at.on('pan', ev => {
            this.transitionDuration = 0;
            this.x += ev.deltaX;
            this.y += ev.deltaY;
            C(ev, '#968');
        })

        at.on('press', ev => {
            this.scale = 0.9;
            C(ev, '#168');
        })

        at.on('pressup', ev => {
            this.scale = 1;
            C(ev, '#996');
        })


        at.on('pinch', ev => {
            this.transitionDuration = 0;
            this.scale *= ev.deltaScale;
        });


        at.on('rotate', ev => {
            this.transitionDuration = 0;
            this.angle += ev.deltaAngle;
        });

    },

    watch: {
        message() {
            this.activeType = this.message.type;
        }
    }
});