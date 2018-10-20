import { dispatchTouchStart, dispatchTouchMove, dispatchTouchEnd } from './touchEventSmulate';
import AnyTouch from '../src/main'

document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);

test('当前是否移动设备?', () => {
    expect(at.isMobile).toBeTruthy();
});

 