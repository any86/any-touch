import AnyTouch from 'any-touch';
import { GestureSimulator, sleep } from '@any-touch/simulator';

test(`AnyTouch是否默认加载了所有手势`, async done => {
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const mockCallback = jest.fn();
    const gs = new GestureSimulator(el);
    expect(at.get('tap')).toBeDefined();
    expect(at.get('swipe')).toBeDefined();
    expect(at.get('rotate')).toBeDefined();
    expect(at.get('pinch')).toBeDefined();
    expect(at.get('press')).toBeDefined();
    expect(at.get('pan')).toBeDefined();
    at.on('tap',mockCallback);
    gs.start();
    gs.end();
    await sleep();
    expect(mockCallback).toHaveBeenCalled();
    done();
});
