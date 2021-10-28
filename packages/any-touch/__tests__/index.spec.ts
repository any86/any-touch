import AnyTouch from 'any-touch';
import { GestureSimulator, sleep } from '@any-touch/simulator';

test(`AnyTouch是否默认加载了所有手势`, async done => {
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const mockCallback = jest.fn();
    const gs = new GestureSimulator(el);
    expect(at.__recognizerMap).toHaveProperty(['tap']);
    expect(at.__recognizerMap).toHaveProperty(['swipe']);
    expect(at.__recognizerMap).toHaveProperty(['rotate']);
    expect(at.__recognizerMap).toHaveProperty(['pinch']);
    expect(at.__recognizerMap).toHaveProperty(['press']);
    expect(at.__recognizerMap).toHaveProperty(['pan']);
    expect(at.__recognizers).toHaveLength(6);

    at.on('tap',mockCallback);
    gs.start();
    gs.end();
    await sleep();
    expect(mockCallback).toHaveBeenCalled();
    done();
});
