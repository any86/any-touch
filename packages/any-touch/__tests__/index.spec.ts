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
    expect(AnyTouch.STATE_CANCELLED).toBeDefined();
    expect(AnyTouch.STATE_END).toBeDefined();
    expect(AnyTouch.STATE_FAILED).toBeDefined();
    expect(AnyTouch.STATE_MOVE).toBeDefined();
    expect(AnyTouch.STATE_POSSIBLE).toBeDefined();
    expect(AnyTouch.STATE_RECOGNIZED).toBeDefined();
    expect(AnyTouch.STATE_START).toBeDefined();
    at.on('tap', mockCallback);
    gs.start();
    gs.end();
    await sleep();
    expect(mockCallback).toHaveBeenCalled();
    done();
});

test(`通过disabled禁用tap`, done => {
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const mockCallback = jest.fn();
    const gs = new GestureSimulator(el);
    at.on('tap', mockCallback);
    const tapContext = at.get('tap');
    if (tapContext) {
        tapContext.disabled = true;
    }

    gs.start();
    gs.end();

    expect(mockCallback).toHaveBeenCalledTimes(0);
    done();
});