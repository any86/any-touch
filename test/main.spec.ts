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
    let data = 0;
    let xOrg = 0;
    let yOrg = 0;

    at.on('panmove', ({
        deltaX,
        deltaY
    }) => {
        console.log(JSON.stringify({
            deltaX,
            deltaY
        }));
        xOrg += deltaX;
        yOrg += deltaY;
    });

    at.on('panend', (e) => {
        console.log('panend 啊圣诞节哦')
        expect(xOrg).toBe(100);
        expect(yOrg).toBe(100);
        done();
    });

    // 模拟touch触碰
    {
        let x: any = 0;
        let y: any = 0;
        let i: number = 0;
        dispatchTouchStart(el, { x, y });
        let timer = setInterval(() => {
            i++;
            if (100 < x) {
                clearInterval(timer);
                dispatchTouchEnd(el, { x, y });
            } else {
                y = x = i;
                console.log({x});
                dispatchTouchMove(el, { x, y });
            }
        }, 10);
    }
});