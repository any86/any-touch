import TouchSimulator from './utils/TouchSimulator';
import AnyTouch from '../src/main';
import sleep from './utils/sleep';
const el = document.createElement('div');
let at: AnyTouch, ts: TouchSimulator;

beforeEach(() => {
    at = new AnyTouch(el);
    ts = new TouchSimulator(el);
})

afterEach(() => {
    at.destroy();
});

test('panstart中加入stop, 那么panmove不会触发', async (done) => {
    const mockCallback = jest.fn();
    at.on('panstart', ev => {
        at.stop();
        expect(ev.type).toBe('panstart');
    })

    at.on(`panmove`, (ev) => {
        mockCallback();
    });

    // 模拟事件
    ts.dispatchTouchStart([{ x: 0, y: 0 }]);
    ts.dispatchTouchMove([{ x: 30, y: 30 }]);
    ts.dispatchTouchMove([{ x: 60, y: 60 }]);
    ts.dispatchTouchMove([{ x: 90, y: 90 }]);
    ts.dispatchTouchMove([{ x: 120, y: 120 }]);
    ts.dispatchTouchEnd();
    await sleep(50);
    expect(mockCallback.mock.calls.length).toBe(0);
    done();
});
