import AnyTouch from '../src/main'


test('当前是否移动设备?', () => {
    // let { jsdom } = <any>global;
    // // console.log(jsdom.window);
    // Object.defineProperty(jsdom.window.navigator, 'userAgent', {value:"Mellblomenator/9000"})
    document.body.innerHTML = '<div id="box">box</div>';
    const el = document.getElementById('box');
    const at = new AnyTouch(el);

    expect(at.isMobile).toBeTruthy();
});