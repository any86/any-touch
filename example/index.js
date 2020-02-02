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
        function C(ev, bgColor = '#f10', color = '#fff') {
            console.log(
                `%c${ev.type}`,
                `color:${color};background-color:${bgColor};padding:2px 8px;border-radius:999px;`,
                ev
            );
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
        const el2 = this.$refs.circle2;

        el.addEventListener('pan', (ev) => {
            // console.log(ev)
        });
        AnyTouch.use(AnyTouch.Tap, { name: 'doubletap', tapTimes: 2, maxDistanceFromPrevTap: 20 });
        // 初始化
        const at = new AnyTouch(document.getElementById('app'));
        at.on('at:input', (ev) => {
            // console.dir(ev.target)
        });




        let timer = null;
        at.beforeEach(({ recognizerMap, name }, next) => {
            if ('tap' === name) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    console.warn(recognizerMap.doubletap.status)
                    if ('possible' === recognizerMap.doubletap.status) next();
                }, 300)
            } else {
                next();
            }
        });

        at.target(el).on('pinch', (ev) => {
            console.log(ev.type);
        });

        at.target(el).on('tap', (ev) => {
            this.scale = 0.8;
            setTimeout(() => {
                this.scale = 1;
            }, 100);
            C(ev, '#f10');
        });
        at.target(el).on('doubletap', (ev) => {
            this.scale = 0.1;
            setTimeout(() => {
                this.scale = 1;
            }, 100);
            C(ev, '#110');
        });

        at.target(el2).on('tap', (ev) => {
            this.scale = 0.8;
            setTimeout(() => {
                this.scale = 1;
            }, 100);
            C(ev, '#fc0');
        });

        at.target(el).on('swipe', (ev) => {
            this.transitionDuration = 200;
            this.x += ev.speedX * 50;
            this.y += ev.speedY * 50;
            C(ev, '#680');
        });

        at.target(el).on('pan', (ev) => {
            this.transitionDuration = 0;
            this.x += ev.deltaX;
            this.y += ev.deltaY;
            C(ev, '#99c');
        });

        at.target(el).on('panend', (ev) => {
            C(ev, '#19c');
        });

        at.target(el).on('press', (ev) => {
            this.scale = 0.9;
            C(ev, '#168');
        });

        at.target(el).on('pressup', (ev) => {
            this.scale = 1;
            C(ev, '#996');
        });

        at.target(el).on('pinch', (ev) => {
            this.transitionDuration = 0;
            this.scale *= ev.deltaScale;
        });

        at.target(el).on('rotate', (ev) => {
            this.transitionDuration = 0;
            this.angle += ev.deltaAngle;
        });
    },

    watch: {
        message() {
            this.activeType = this.message.type;
        }
    },

    methods: {
        reset() {
            this.angle = 0;
            this.scale = 1;
            this.x = window.innerWidth / 2 - 100;
            this.y = window.innerHeight / 2 - 100;
            this.centerX = 0;
            this.centerY = 0;
            this.transitionDuration = 0;
        }
    }
});
