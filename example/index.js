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
            console.log(`%c${ev.type}`, `color:${color};background-color:${bgColor};padding:2px 8px;border-radius:999px;`, ev)
        }

        // hack 解决document.body 的cancelable不能等于true
        // const gEl = document.body
        // gEl.addEventListener('touchstart', ev=>{
        //     console.log(`touchstart`,ev.cancelable)
        //    ev.preventDefault();
        // }, {passive:false})

        // gEl.addEventListener('touchmove', ev=>{
        //     console.log(`touchmove`,ev.cancelable)
        //     ev.preventDefault();
        // }, {passive:false})


        const el = this.$refs.circle;
        el.addEventListener('pan', ev => {
            // console.log(ev)
        })
        // 初始化
        const at = new AnyTouch(document.getElementById('app'));
        at.target(el).on('input', ev => {
            console.dir(ev.target)
            // console.log(ev);
        })


        at.target(el).on('pinch', ev => {
            C(ev, '#f99');
        });

        at.target(el).on('tap', ev => {
            this.scale = 0.8;
            setTimeout(() => {
                this.scale = 1;
            }, 100)
            C(ev, '#f10');
        });

        at.target(el).on('swipe', ev => {
            this.transitionDuration = 200;
            this.x += ev.speedX * 50;
            this.y += ev.speedY * 50;
            C(ev, '#680');
        });

        at.target(el).on('pan', ev => {
            this.transitionDuration = 0;
            this.x += ev.deltaX;
            this.y += ev.deltaY;
            C(ev, '#99c');
        })

        at.target(el).on('press', ev => {
            this.scale = 0.9;
            C(ev, '#168');
        })

        at.target(el).on('pressup', ev => {
            this.scale = 1;
            C(ev, '#996');
        })


        at.target(el).on('pinch', ev => {
            this.transitionDuration = 0;
            this.scale *= ev.deltaScale;
        });


        at.target(el).on('rotate', ev => {
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