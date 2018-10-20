import { dispatchTouchStart, dispatchTouchMove, dispatchTouchEnd } from './touchEventSmulate';
import AnyTouch from '../src/main'

document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);

test('当前是否移动设备?', () => {
    expect(at).toHaveProperty('on');
    expect(at.recognizers).toHaveLength(6);
    expect(at.unbinders).toHaveLength(4);
    expect(at.$el).toEqual(el);
    expect(at.isMobile).toBeTruthy();
});

test('事件pan是否生效?', (done) => {
    let xOrg = 0;
    let yOrg = 0;

    at.on('panmove', ({
        deltaX,
        deltaY
    }) => {
        xOrg += deltaX;
        yOrg += deltaY;
    });

    at.on('panend', (e) => {
        expect(xOrg).toBe(100);
        expect(yOrg).toBe(100);
        done();
    });




    // 模拟touch触碰
    {
        dispatchTouchStart(el, { x: 0, y: 0 });
        dispatchTouchMove(el, { x: 10, y: 10 });
        dispatchTouchMove(el, { x: 100, y: 100 });

        setTimeout(() => {
            dispatchTouchEnd(el, { x: 100, y: 100 });
        }, 200);
    }
});