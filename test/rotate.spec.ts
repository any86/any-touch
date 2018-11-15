import rotateSimulator from './utils/Gesture/rotateSimulator';
import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);
const ANGLES_TEST = [5, 15];
const ROTATE = 'rotate';

test('rotate旋转角度是否计算正确?', (done) => {
    let times = 0;
    at.on('rotate', ({ type, angle }) => {
        expect(type).toBe('rotate');
        let expectAngle = Math.round(angle);
        let receiveAngle = ANGLES_TEST[times];
        expect(expectAngle).toBe(receiveAngle);
        times++;
        done();
    });
    rotateSimulator(el, { angles: ANGLES_TEST });
});


['start', 'move', 'end'].forEach(name => {
    test(`${ROTATE}${name}触发?`, (done) => {
        at.off(ROTATE);
        at.on(ROTATE + name, ({ type }) => {
            expect(type).toBe(ROTATE + name);
            done();
        });
        rotateSimulator(el, { angles: ANGLES_TEST });
    });

})
