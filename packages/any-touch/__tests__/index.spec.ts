import AnyTouch from 'any-touch';
import { GestureSimulator, sleep } from '@any-touch/simulator';

test(`AnyTouch是否默认加载了所有手势`, async done => {
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const mockCallback = jest.fn();
    const gs = new GestureSimulator(el);
    expect(at.recognizerMap).toHaveProperty(['tap']);
    expect(at.recognizerMap).toHaveProperty(['swipe']);
    expect(at.recognizerMap).toHaveProperty(['rotate']);
    expect(at.recognizerMap).toHaveProperty(['pinch']);
    expect(at.recognizerMap).toHaveProperty(['press']);
    expect(at.recognizerMap).toHaveProperty(['pan']);
    expect(at.recognizers).toHaveLength(6);

    at.on('tap',mockCallback);
    gs.dispatchTouchStart();
    gs.dispatchTouchEnd();
    await sleep();
    expect(mockCallback).toHaveBeenCalled();
    done();
});
