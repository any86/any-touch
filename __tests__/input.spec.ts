import TouchSimulator from './utils/TouchSimulator';
import AnyTouch from '../src/main';
const mockCallback = jest.fn();
const el = document.createElement('div');
const at = new AnyTouch(el);
/**
 * 模拟向下滑动
 */
const simulatorPan = () => {
    const ts = new TouchSimulator(el, { device: 'touch' });
    ts.dispatchTouchStart([{ x: 30, y: 0 }]);
    ts.dispatchTouchMove([{ x: 30, y: 15 }]);
    ts.dispatchTouchStart([{ x: 30, y: 15 }, { x: 130, y: 10 }]);
    ts.dispatchTouchEnd(0, 1);
    ts.dispatchTouchMove([{ x: 30, y: 5 }]);
    ts.dispatchTouchStart([{ x: 30, y: 5 }, { x: 100, y: 0 }]);
    ts.dispatchTouchMove([{ x: 30, y: 90 }, { x: 100, y: 10 }]);
    ts.dispatchTouchCancel();
};


test(`input触发次数是否正确?`, done => {
    at.on('input', ({
        type
    }) => {
        mockCallback();
        expect(type).toBe('input');
    });

    at.on('inputstart', ({
        type
    }) => {
        expect(mockCallback.mock.calls.length).toBe(1);
        expect(type).toBe('inputstart');
    });

    at.on('inputreduce', ({
        type
    }) => {
        expect(mockCallback.mock.calls.length).toBe(4);
        expect(type).toBe('inputreduce');
    });


    at.on('inputadd', ({
        type
    }) => {
        expect(mockCallback.mock.calls.length).toBeGreaterThanOrEqual(3);// 3 || 6
        expect(type).toBe('inputadd');
    });

    at.on('inputmove', ({
        type
    }) => {
        expect(type).toBe('inputmove');
    });

    at.on('inputcancel', ({
        type
    }) => {
        expect(type).toBe('inputcancel');
    });


    at.on('inputend', ({
        type
    }) => {
        expect(mockCallback.mock.calls.length).toBe(8);
        expect(type).toBe('inputend');
    });

    // 模拟事件
    simulatorPan();
    done();
});