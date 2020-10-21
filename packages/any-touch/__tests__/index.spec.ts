import AnyTouch from 'any-touch';
import { GestureSimulator, sleep } from '@any-touch/simulator';

test(`AnyTouch是否默认加载了所有手势`, async done => {
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const mockCallback = jest.fn();
    const gs = new GestureSimulator(el);
    expect(at._$recognizerMap).toHaveProperty(['tap']);
    expect(at._$recognizerMap).toHaveProperty(['swipe']);
    expect(at._$recognizerMap).toHaveProperty(['rotate']);
    expect(at._$recognizerMap).toHaveProperty(['pinch']);
    expect(at._$recognizerMap).toHaveProperty(['press']);
    expect(at._$recognizerMap).toHaveProperty(['pan']);
    expect(at._$recognizers).toHaveLength(6);

    at.on('tap',mockCallback);
    gs.start();
    gs.end();
    await sleep();
    expect(mockCallback).toHaveBeenCalled();
    done();
});
