import TouchSimulator from '../TouchSimulator';
interface Options {
    scales?: number[]
};
export default (el: Element, { scales = [2, 3] }: Options={}) => {
    const ts = new TouchSimulator(el);
    const startX = 200;
    ts.dispatchTouchStart([{ x: 0, y: 0 }, { x: startX, y: 0 }]);
    scales.forEach(scale => {
        ts.dispatchTouchMove([{ x: 0, y: 0 }, { x: startX*scale, y: 0 }]);
    });
    ts.dispatchTouchEnd();
};
