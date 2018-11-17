import TouchSimulator from '../TouchSimulator';
interface Options {
    pointerLength?: number;
    direction?: string;
};

/**
 * 模拟PinchIn
 */
export const pinchIn = (el:Element) => {
    const ts = new TouchSimulator(el);
    ts.dispatchTouchStart([{ x: 0, y: 0 }, { x: 200, y: 0 }]);
    ts.dispatchTouchMove([{ x: 0, y: 0 }, { x: 100, y: 0 }]);
    ts.dispatchTouchMove([{ x: 0, y: 0 }, { x: 40, y: 0 }]);
    ts.dispatchTouchEnd();
};

/**
 * 模拟PinchOut
 */
export const pinchOut = (el:Element) => {
    const ts = new TouchSimulator(el);
    ts.dispatchTouchStart([{ x: 0, y: 0 }, { x: 50, y: 0 }]);
    ts.dispatchTouchMove([{ x: 0, y: 0 }, { x: 100, y: 0 }]);
    ts.dispatchTouchMove([{ x: 0, y: 0 }, { x: 170, y: 0 }]);
    ts.dispatchTouchEnd();
};