import Vue from 'vue';
import TouchSimulator from '../utils/TouchSimulator';
import sleep from '../utils/sleep';
import AnyTouch from '../../src/main';
const el = document.createElement('div');
Vue.use(AnyTouch.vTouch);
test('vue指令版本初始化是否成功?', async (done) => {
    Vue.config.devtools = false;
    Vue.config.productionTip = false;

    const app = new Vue({
        el,

        render(h) {
            return h('div', {
                // nativeOn:{
                //     touchstart(){
                //         console.table('touchstarr');
                //     }
                // },
                ref: 'box',

                directives: [{
                    name: 'touch',
                    value(ev:any) {
                        console.log('@',ev.type);
                    },
                    arg: 'tap',
                }]
            });
        },

        async mounted() {
            console.log('mounted', this.$refs.box)
            const ts = new TouchSimulator(el);
            // 模拟touch触碰
            ts.dispatchTouchStart([{ x: 0, y: 0 }]);
            await sleep(100);
            ts.dispatchTouchEnd();
            await sleep(100);
            done();
        },

        methods: {
            // tapHandler(ev: any) {
            //     console.log(ev.type);
            //     expect(ev.type).toBe('tap');
            // }
        }
    });

});