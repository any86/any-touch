import TouchSimulator from '../TouchSimulator';
interface Options {
    velocity?: number;
    pointerLength?: number;
    direction?: string;
};
export default function (el: Element, { velocity = 0.3, pointerLength = 1, direction = 'up' }: Options = <Options>{}) {
    let ts = new TouchSimulator(el);
    // MIN_INTERVAL_TIME秒后, swipe才能得到非0的计算值
    const MIN_INTERVAL_TIME = 25;
    const MAX_DISTANCE = 100;
    if ('up' === direction) {
        ts.dispatchTouchStart([{ x: 0, y: MAX_DISTANCE }]);
        setTimeout(() => {
            ts.dispatchTouchMove([{ x: 0, y: MAX_DISTANCE/2 }]);
            ts.dispatchTouchEnd();
        }, MIN_INTERVAL_TIME);
    } else if('down' === direction) {
        ts.dispatchTouchStart([{ x: 0, y: MAX_DISTANCE }]);
        setTimeout(() => {
            ts.dispatchTouchMove([{ x: 0, y: MAX_DISTANCE*2 }]);
            ts.dispatchTouchEnd();
        }, MIN_INTERVAL_TIME);
    }else if('left' === direction) {
        ts.dispatchTouchStart([{ x: MAX_DISTANCE, y: 0 }]);
        setTimeout(() => {
            ts.dispatchTouchMove([{ x: 20, y: 0 }]);
            ts.dispatchTouchEnd();
        }, MIN_INTERVAL_TIME);
    }else if('right' === direction) {
        ts.dispatchTouchStart([{ x: 0, y: 0 }]);
        setTimeout(() => {
            ts.dispatchTouchMove([{ x: MAX_DISTANCE, y: 0 }]);
            ts.dispatchTouchEnd();
        }, MIN_INTERVAL_TIME);
    }
};