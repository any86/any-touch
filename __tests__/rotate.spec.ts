import rotateSimulator from './utils/Gesture/rotateSimulator';
import AnyTouch from '../src/main'
const el = document.createElement('div');

const at = new AnyTouch(el);

const ROTATE = 'rotate';

test('rotate旋转角度是否计算正确?', (done) => {
    const ANGLES_TEST = [5, 15,-10];
    let times = 0;
    at.on('rotate', ({ type, angle }) => {
        let receiveAngle = Math.round(angle);
        let expectAngle = ANGLES_TEST[times];
        if(0 < receiveAngle) {
            expect(expectAngle).toBe(receiveAngle);
            times++;
        }
    });

    at.on('rotateend', ev => {
        done();
    });
    rotateSimulator(el, { angles: ANGLES_TEST });
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
