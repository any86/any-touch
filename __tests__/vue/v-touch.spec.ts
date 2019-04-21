import Vue from 'vue';
import TouchSimulator from '../utils/TouchSimulator';
import sleep from '../utils/sleep';
import AnyTouch from '../../src/main';

let el: HTMLElement;

beforeEach(() => {
    el = document.createElement('div');
    Vue.config.devtools = false;
    Vue.config.productionTip = false;
    Vue.use(AnyTouch.vTouch);
});

test('v-touch没有导出情况下, 是否运行正常以及销毁功能正常?', async (done) => {
    const mockCallback = jest.fn();
    new Vue({
        el,

        data: {
            hasTouch: true
        },

        render(h) {
            if (!this.hasTouch) return h();
            return h('div', {
                ref: 'box',
                on: {
                    tap(ev: any) {
                        mockCallback();
                        expect(ev.type).toBe('tap');
                    }
                },
                directives: [{
                    name: 'touch'
                }]
            });
        },

        async mounted() {
            const boxEl: any = this.$refs.box;
            const ts = new TouchSimulator(boxEl);
            // 模拟touch触碰
            ts.dispatchTouchStart([{ x: 0, y: 0 }]);
            await sleep(100);
            ts.dispatchTouchEnd();
            await sleep(100);

            // 销毁box元素
            this.hasTouch = false;
            // 模拟touch触碰
            ts.dispatchTouchStart([{ x: 0, y: 0 }]);
            await sleep(100);
            ts.dispatchTouchEnd();
            await sleep(100);

            expect(mockCallback.mock.calls.length).toBe(1);
            done()
        }
    });
});


test('v-touch导出,并设置requireFailure', async (done) => {
    const mockCallback = jest.fn();
    new Vue({
        el,

        data:{
            gesture: ''
        },

        render(h) {
            return h('div', {
                ref: 'box',
                on: {
                    tap(ev: any) {
                        mockCallback();
                    },

                    doubletap:(ev: any)=> {
                        mockCallback();
                        this.gesture = ev.type;
                        expect(ev.type).toBe('doubletap');
                    },
                },
                directives: [{
                    name: 'touch',
                    value(at:any){
                        const doubletap = at.get('doubletap');
                        doubletap.disabled = false;
                        at.get('tap').requireFailure(doubletap);
                    }
                }]
            }, [this.gesture]);
        },

        async mounted() {
            const boxEl: any = this.$refs.box;
            const ts = new TouchSimulator(boxEl);
            // 模拟touch触碰
            ts.dispatchTouchStart([{ x: 0, y: 0 }]);
            await sleep(100);
            ts.dispatchTouchEnd();
            await sleep(100);

            // 模拟touch触碰
            ts.dispatchTouchStart([{ x: 0, y: 0 }]);
            await sleep(100);
            ts.dispatchTouchEnd();
            await sleep(100);

            expect(mockCallback.mock.calls.length).toBe(1);
            done()
        }
    });
});