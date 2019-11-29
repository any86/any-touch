import TouchSimulator from './utils/TouchSimulator';
import sleep from './utils/sleep';
import AnyTouch from '../src/main'
const el = document.createElement('div');
const ts = new TouchSimulator(el);
const mockCallback = jest.fn();
test('isStart和isEnd是否计算正确?', async (done) => {
    const at = new AnyTouch(el);
    at.on('input', ({ isStart, isEnd }) => {
        mockCallback(isStart, isEnd)
    });
    ts.dispatchTouchStart([{x:1,y:1}]);
    ts.dispatchTouchMove([{x:11,y:1}]);
    ts.dispatchTouchStart([{x:111,y:1},{x:222,y:2}]);
    ts.dispatchTouchEnd(1,1);
    ts.dispatchTouchEnd();

    await sleep(50);
    expect(mockCallback.mock.calls[0][0]).toBeTruthy();
    expect(mockCallback.mock.calls[0][1]).toBeFalsy();
    expect(mockCallback.mock.calls[1][0]).toBeFalsy();
    expect(mockCallback.mock.calls[1][1]).toBeFalsy();
    expect(mockCallback.mock.calls[2][0]).toBeTruthy();
    expect(mockCallback.mock.calls[2][1]).toBeFalsy();
    expect(mockCallback.mock.calls[3][0]).toBeFalsy();
    expect(mockCallback.mock.calls[3][1]).toBeFalsy();
    expect(mockCallback.mock.calls[4][1]).toBeTruthy();

    done();
});