import TouchSimulator from './utils/TouchSimulator';
import AnyTouch from '../src/main';
import sleep from './utils/sleep';
const mockCallback = jest.fn();
const mockAllInputCallback = jest.fn();

const el = document.createElement('div');
const at = new AnyTouch(el);
/**
 * 模拟向下滑动
 */
const simulatorPan = () => {
    const ts = new TouchSimulator(el, { device: 'touch' });
    ts.dispatchTouchStart([{ x: 30, y: 0 }]);
    ts.dispatchTouchMove([{ x: 30, y: 15 }]);
    ts.dispatchTouchStart([{ x: 130, y: 10 }]);
    ts.dispatchTouchMove([{ x: 30, y: 0 }, { x: 100, y: 10 }]);
    ts.dispatchTouchEnd();

    // 模拟cancel
    ts.dispatchTouchStart([{ x: 30, y: 0 }]);
    ts.dispatchTouchMove([{ x: 30, y: 15 }]);
    ts.dispatchTouchCancel();
};

test(`input触发次数是否正确?`, done => {
    at.on('input', ({
        type
    }) => {
        mockAllInputCallback(type);
    });

    // 模拟事件
    simulatorPan();
    sleep(100);
    expect(mockAllInputCallback.mock.calls[0][0]).toBe('input');
    expect(mockAllInputCallback.mock.calls.length).toBe(8);

    done();
});


test.skip(`input触发次数是否正确?`, done => {
    at.on('input', ({
        type
    }) => {
        mockAllInputCallback(type);
    });

    at.on('inputstart', ({
        type
    }) => {
        mockCallback(type);
    });

    at.on('inputmove', ({
        type
    }) => {
        mockCallback(type);
    });

    at.on('inputcancel', ({
        type
    }) => {
        mockCallback(type);
    });


    at.on('inputend', ({
        type
    }) => {
        mockCallback(type);
    });

    // 模拟事件
    simulatorPan();
    sleep(100);
    expect(mockCallback.mock.calls[0][0]).toBe('inputstart');
    expect(mockCallback.mock.calls[1][0]).toBe('inputmove');
    expect(mockCallback.mock.calls[2][0]).toBe('inputstart');
    expect(mockCallback.mock.calls[3][0]).toBe('inputmove');
    expect(mockCallback.mock.calls[4][0]).toBe('inputend');

    expect(mockCallback.mock.calls[5][0]).toBe('inputstart');
    expect(mockCallback.mock.calls[6][0]).toBe('inputmove');
    expect(mockCallback.mock.calls[7][0]).toBe('inputcancel');

    done();
});