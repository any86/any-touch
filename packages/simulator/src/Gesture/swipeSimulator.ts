import TouchSimulator from '../GestureSimulator';
interface Options {
    pointLength?: number;
    direction?: string;
};
const MIN_INTERVAL_TIME = 25;
const MAX_DISTANCE = 300;

// swipedown
export const swipeDown = (el: Element) => {
    let ts = new TouchSimulator(el);
    ts.dispatchTouchStart([{ x: 0, y: MAX_DISTANCE }]);
    setTimeout(() => {
        ts.dispatchTouchMove([{ x: 0, y: MAX_DISTANCE * 2 }]);
        ts.dispatchTouchEnd();
    }, MIN_INTERVAL_TIME);
}

export const swipeUp = (el: Element) => {
    let ts = new TouchSimulator(el);
    ts.dispatchTouchStart([{ x: 0, y: MAX_DISTANCE }]);
    setTimeout(() => {
        ts.dispatchTouchMove([{ x: 0, y: 20 }]);
        ts.dispatchTouchEnd();
    }, MIN_INTERVAL_TIME);
}


export const swipeRight = (el: Element) => {
    let ts = new TouchSimulator(el);
    ts.dispatchTouchStart([{ x: MAX_DISTANCE / 2, y: 0 }]);
    setTimeout(() => {
        ts.dispatchTouchMove([{ x: MAX_DISTANCE, y: 0 }]);
        ts.dispatchTouchEnd();
    }, MIN_INTERVAL_TIME);
}

export const swipeLeft = (el: Element) => {
    let ts = new TouchSimulator(el);
    ts.dispatchTouchStart([{ x: 100, y: 0 }]);
    setTimeout(() => {
        ts.dispatchTouchMove([{ x: 20, y: 0 }]);
        ts.dispatchTouchEnd();
    }, 30);
};



export default function (el: Element, { direction = 'up', pointLength = 1 }: Options = <Options>{}) {
    // MIN_INTERVAL_TIME秒后, swipe才能得到非0的计算值
    const FN_MAP: any = {
        up: swipeUp,
        down: swipeDown,
        right: swipeRight,
        left: swipeLeft
    };

    FN_MAP[direction](el);
};