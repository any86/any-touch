import rotateSimulator from './utils/Gesture/rotateSimulator';
import AnyTouch from '../src/main'
import sleep from './utils/sleep';
const el = document.createElement('div');
const at = new AnyTouch(el);
const mockCallback = jest.fn();

test('rotate旋转角度是否计算正确?', async (done) => {
    const ANGLES_TEST = [5, 15, -10];
    let times = 0;
    at.on('rotate', ({ angle }) => {
        let receiveAngle = Math.round(angle);
        let expectAngle = ANGLES_TEST[times];
        if (0 < receiveAngle) {
            expect(expectAngle).toBe(receiveAngle);
            times++;
        }
    });

    at.on('rotateend', ev => {
        mockCallback();
    });

    // 模拟旋转
    rotateSimulator(el, { angles: ANGLES_TEST });

    // 是否触发了rotateend
    expect(mockCallback.mock.calls.length).toBe(1);
    await sleep(100);
    done();
});


// ['start', 'move', 'end'].forEach(name => {
//     const ANGLES_TEST = [15, 5];
//     test(`${ROTATE}${name}触发?`, (done) => {
//         at.off(ROTATE);
//         at.on(ROTATE + name, ({ type }) => {
//             expect(type).toBe(ROTATE + name);
//         });
//         rotateSimulator(el, { angles: ANGLES_TEST });
//         done();
//     });
// })
