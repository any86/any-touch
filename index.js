import AnyTouch from './src/main.ts';
let log = console.log;
log = () => { };
new Vue({
    el: '#app',

    data() {
        return {
            angle: 0,
            scale: 1,
            x: 0,
            y: 0,
            centerX: 0,
            centerY: 0,
            message: 'AnyTouch'
        };
    },
    mounted() {
        const tap2 = new AnyTouch.TapRecognizer({ name: 'doubletap', pointer: 1, taps: 2 })
        const tap3 = new AnyTouch.TapRecognizer({ name: 'threetap', pointer: 1, taps: 3 })
        const anyTouch = new AnyTouch(this.$refs.circle);
        anyTouch.add(tap2);
        anyTouch.add(tap3);
        const tap1 = anyTouch.get('tap');
        tap1.requireFailure(tap2);
        tap1.requireFailure(tap3);
        tap2.requireFailure(tap3);
        /**
         * =========================== pan ===========================
         */
        anyTouch.on('panstart', e => {
            this.message = e;
            log(e.type);
        });

        anyTouch.on('panmove', e => {
            this.message = e;
            log(e.type);
        });

        anyTouch.on('panend', e => {
            this.message = e;
            log(e.type);
        });



        anyTouch.on('pan', e => {
            e.preventDefault();
            log(e);
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
            console.log(`%c ${e.type} `, 'background-color:#f10;color:#fff;');
            this.message = e;
        });

        anyTouch.on('doubletap', e => {
            console.log(`%c ${e.type} `, 'background-color:#9c3;color:#fff;');
            this.message = e;
        });

        anyTouch.on('threetap', e => {
            console.log(`%c ${e.type} `, 'background-color:#99c;color:#fff;');
            this.message = e;
        });

        anyTouch.on('fourtap', e => {
            console.log(`%c ${e.type} `, 'background-color:#847;color:#fff;');
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
            e.preventDefault();
            this.message = e;
            this.scale *= e.deltaScale;
            this.centerX = e.centerX;
            this.centerY = e.centerY;
            log(`%c ${e.type} `, 'background-color:#f90;color:#fff;');
        });

        /**
         * =========================== rotate ===========================
         */
        ['rotatestart', 'rotatemove', 'rotateend'].forEach(name => {
            anyTouch.on(name, e => {
                log(e.type);
                this.message = e;
            })
        });

        anyTouch.on('rotate', e => {
            e.preventDefault();
            this.message = e;
            this.angle += e.deltaAngle;
            this.centerX = e.centerX;
            this.centerY = e.centerY;
        });

        /**
         * =========================== swipe ===========================
         */
        ['swipeup', 'swipeleft', 'swiperight', 'swipedown'].forEach(name => {
            anyTouch.on(name, e => {
                log(e.type);
                // switch (name) {
                //     case 'swipeup':
                //         {
                //             this.y = this.y - 200;
                //             break;
                //         };

                //     case 'swipedown':
                //         {
                //             this.y = this.y + 200;
                //             break;
                //         };
                //     case 'swipeleft':
                //         {
                //             this.x = this.x - 200;
                //             break;
                //         };

                //     case 'swiperight':
                //         {
                //             this.x = this.x + 200;
                //             break;
                //         };
                // };

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
            // console.log('touchstart', e.touches, e.touches.length, e.changedTouches.length);
        },
        touchmove(e) {
            // console.log('touchmove', e, e.touches.length, e.changedTouches.length);
        },
        touchend(e) {
            // console.log('touchend', e, e.touches.length, e.changedTouches.length);
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
    }
});