// https://jestjs.io/docs/en/manual-mocks
//必须放在第一行
// window.ontouchstart = null; //jest.fn();
// let g :any= global
// g.ontouchstart = null; //jest.fn();
import AnyTouch from '../src/main';
// console.log({ global })
test('当前是否移动设备?', () => {
    // console.log('ontouchstart', !!window.ontouchstart);
    // console.log(process.env.NODE_ENV);
    // let { jsdom } = <any>global;
    // // console.log(jsdom.window);
    // Object.defineProperty(jsdom.window.navigator, 'userAgent', {value:"Mellblomenator/9000"})
    const el = document.createElement('div');
    
    const at = new AnyTouch(el);
    expect(at.inputType).toBe('touch');
});