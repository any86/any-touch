import TouchSimulator from '../GestureSimulator';
interface Options {
    pointLength?: number;
    direction?: string;
};
const MIN_INTERVAL_TIME = 25;
const MAX_DISTANCE = 300;

// swipedown
export const swipeDown = (el: HTMLElement) => {
    let ts = new TouchSimulator(el);
    ts.start([{ x: 0, y: MAX_DISTANCE }]);
    setTimeout(() => {
        ts.move([{ x: 0, y: MAX_DISTANCE * 2 }]);
        ts.end();
    }, MIN_INTERVAL_TIME);
}

export const swipeUp = (el: HTMLElement) => {
    let ts = new TouchSimulator(el);
    ts.start([{ x: 0, y: MAX_DISTANCE }]);
    setTimeout(() => {
        ts.move([{ x: 0, y: 20 }]);
        ts.end();
    }, MIN_INTERVAL_TIME);
}


export const swipeRight = (el: HTMLElement) => {
    let ts = new TouchSimulator(el);
    ts.start([{ x: MAX_DISTANCE / 2, y: 0 }]);
    setTimeout(() => {
        ts.move([{ x: MAX_DISTANCE, y: 0 }]);
        ts.end();
    }, MIN_INTERVAL_TIME);
}

export const swipeLeft = (el: HTMLElement) => {
    let ts = new TouchSimulator(el);
    ts.start([{ x: 100, y: 0 }]);
    setTimeout(() => {
        ts.move([{ x: 20, y: 0 }]);
        ts.end();
    }, 30);
};



export default function (el: HTMLElement, { direction = 'up', pointLength = 1 }: Options = <Options>{}) {
    // MIN_INTERVAL_TIME秒后, swipe才能得到非0的计算值
    const FN_MAP: any = {
        up: swipeUp,
        down: swipeDown,
        right: swipeRight,
        left: swipeLeft
    };

    FN_MAP[direction](el);
};