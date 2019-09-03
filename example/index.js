let log = console.log;
log = () => {};
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
        this.$refs.circle.addEventListener('animationend', e=>{
            this.activeType = 'AnyTouch';
        });

        const tap3 = new AnyTouch.Tap({
            name: 'threetap',
            pointLength: 1,
            tapTimes: 3
        })

        const tap4 = new AnyTouch.Tap({
            name: 'fourtap',
            pointLength: 1,
            tapTimes: 4
        })
        const pan2 = new AnyTouch.Pan({
            name: 'pan2',
            pointLength: 2,
        })

        const el = this.$refs.circle;
        // 初始化
        const anyTouch = new AnyTouch(el, {
            touchAction: 'auto',
            isPreventDefault: false,
            syncToAttr:true
        });


        // el.addEventListener('touchstart', ev=>{
        //     ev.preventDefault();
        //     anyTouch.useEvent(ev);
        // })

        // el.addEventListener('touchmove', ev=>{
        //     anyTouch.useEvent(ev);
        // })

        // el.addEventListener('touchend', ev=>{
        //     anyTouch.useEvent(ev);
        // })


        const tap2 = anyTouch.get('doubletap');
        tap2.disabled = false;

        const pan = anyTouch.get('pan');

        pan.set({
            threshold: 10,
            disabled: false,
            directions: ['left', 'right', 'up', 'down']
        });

        const pinch = anyTouch.get('pinch');
        pinch.set({
            threshold: 0.1
        });

        const rotate = anyTouch.get('rotate');
        rotate.set({
            threshold: 15
        });

        // anyTouch.add(pan2);
        anyTouch.add(tap3);
        anyTouch.add(tap4);
        const tap1 = anyTouch.get('tap');
        tap1.requireFailure(tap3);
        tap1.requireFailure(tap4);
        tap2.requireFailure(tap3);
        tap2.requireFailure(tap4);
        tap3.requireFailure(tap4);
        // this.$refs.circle.addEventListener('touchstart', ev=>{ev.preventDefault()})
        // this.$refs.circle.addEventListener('touchmove', ev=>{ev.preventDefault()})
        // this.$refs.circle.addEventListener('touchend', ev=>{ev.preventDefault()})
        /**
         * =========================== pan ===========================
         */

        // anyTouch.on('input', e => {
        //     this.message = e;
        //     log(e, e.type);
        // });
        anyTouch.on('error', e => {
            console.warn(e);
        });

        // anyTouch.on('pan2', e => {
        //     e.nativeEvent.preventDefault();
        //     this.message = e;
        //     console.warn(e);
        // });

        anyTouch.on('inputstart', e => {
            e.preventDefault();
        });


        anyTouch.on('input', e => {
            // console.warn('input', e);
        });


        anyTouch.on('panstart', e => {
            // e.nativeEvent.preventDefault();
            // anyTouch.set({touchAction:'auto',isPreventDefault:false});
            this.message = e;
            log(e.type);
            
        });

        anyTouch.on('panmove', e => {
            // e.nativeEvent.preventDefault();
            this.message = e;
            log(e.type);
        });

        anyTouch.on('pancancel', e => {
            // e.nativeEvent.preventDefault()
            this.message = e;
            log(e.type);
        });

        anyTouch.on('panend', e => {            
            console.warn('panend',e.direction);
            this.message = e;
            log(e.type);
        });


        anyTouch.on('pan', e => {
            const {deltaXYAngle,deltaX, deltaY} = e;
            log(`%c ${e.type} `, 'background-color:#69c;color:#fff;');
            this.message = e;
            this.x += e.deltaX;
            this.y += e.deltaY;
        });

        /**
         * =========================== press ===========================
         */
        anyTouch.on('press', e => {
            
            log(`%c ${e.type} `, 'background-color:#fa0;color:#fff;');
            this.message = e;
        });

        anyTouch.on('pressup', e => {
            log(`%c ${e.type} `, 'background-color:#f70;color:#fff;');
            this.message = e;
        });

        /**
         * =========================== tap ===========================
         */
        anyTouch.on('tap', e => {
            e.preventDefault();
            log(`%c ${e.type} `, 'background-color:#f10;color:#fff;');
            log(e.x,e.y)
            this.message = e;
        });
        this.$refs.circle.addEventListener('click', ev=>{
            log('click');
        })
        anyTouch.on('doubletap', e => {
            log(`%c ${e.type} `, 'background-color:#9c3;color:#fff;');
            this.message = e;
        });

        anyTouch.on('threetap', e => {
            log(`%c ${e.type} `, 'background-color:#99c;color:#fff;');
            this.message = e;
        });

        anyTouch.on('fourtap', e => {
            log(`%c ${e.type} `, 'background-color:#19c;color:#fff;');
            this.message = e;
        });
        
        /**
         * =========================== pinch ===========================
         */
        ['pinchstart', 'pinchmove', 'pinchend', 'pinchin', 'pinchout'].forEach(name => {
            anyTouch.on(name, e => {
                this.message = e;
                log(e.type);
            })
        });

        anyTouch.on('pinch', e => {
            this.message = e;
            this.scale *= e.deltaScale;
            // log(e.deltaScale);
            this.centerX = e.center.x;
            this.centerY = e.center.y;
            log(`%c ${e.type} `, 'background-color:#f90;color:#fff;');
        });

        /**
         * =========================== rotate ===========================
         */
        ['rotatestart', 'rotatemove', 'rotateend'].forEach(name => {
            anyTouch.on(name, e => {
                log(e.type);
                // this.message = e;
            })
        });

        anyTouch.on('rotate', e => {
            log(e.deltaAngle, e.deltaX,e.deltaY);
            this.message = e;
            this.angle += e.deltaAngle;
            this.centerX = e.center.x;
            this.centerY = e.center.y;
        });

        /**
         * =========================== swipe ===========================
         */
        ['swipeup', 'swipeleft', 'swiperight', 'swipedown'].forEach(name => {
            anyTouch.on(name, e => {
                log(e.type);
                this.message = e;
            })
        });

        anyTouch.on('swipe', e => {
            log(`%c ${e.type} `, 'background-color:#444;color:#fff;');
            this.message = e;
        });
    },

    methods: {
        touchstart(e) {
            // log('touchstart', e.touches, e.touches.length, e.changedTouches.length);
        },
        touchmove(e) {
            // log('touchmove', e, e.touches.length, e.changedTouches.length);
        },
        touchend(e) {
            // log('touchend', e, e.touches.length, e.changedTouches.length);
        },
        testPan() {
            el = this.$refs.circle;
            let x = y = 0;
            dispatchTouchStart();
            let timer = setInterval(() => {
                if (x > 100) {
                    clearInterval(timer);
                    dispatchTouchEnd(100, 100);
                } else {
                    x += 20;
                    y = x;
                    dispatchTouchMove(x, y);
                }
            }, 100)

            function dispatchTouchStart() {
                let event1 = new Event('touchstart', {});
                event1.touches = event1.changedTouches = [{
                    clientX: 0,
                    clientY: 0,
                }];
                el.dispatchEvent(event1);
            }

            function dispatchTouchMove(x, y) {
                let event2 = new Event('touchmove', {});
                event2.touches = event2.changedTouches = [{
                    clientX: x,
                    clientY: y
                }];
                el.dispatchEvent(event2);
            };

            function dispatchTouchEnd(x, y) {
                let event3 = new Event('touchend', {});
                event3.touches = event3.changedTouches = [{
                    clientX: x,
                    clientY: y
                }];
                el.dispatchEvent(event3);
            }
        },

        animationend() {
            // this.message = {};
        },

        // tap() {
        //     log('native tap')
        // }
    },

    watch:{
        message(){
            this.activeType = this.message.type;
        }
    }
});