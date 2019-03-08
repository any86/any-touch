import TouchSimulator from './utils/TouchSimulator';
import sleep from './utils/sleep';
import AnyTouch from '../src/main'
const el = document.createElement('div');

test('添加的识别器名称冲突, 触发错误提示', async (done) => {
    const at = new AnyTouch(el);
    const tap = new AnyTouch.TapRecognizer({ name: 'tap', pointer: 11, taps: 11 });
    at.add(tap);
    at.on('error', ({code,message}:any) => {
        expect(code).toBe(1);
    });
    done();
});
