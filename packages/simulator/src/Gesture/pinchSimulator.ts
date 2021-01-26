import TouchSimulator from '../GestureSimulator';
interface Options {
    scales?: number[]
};
export default (el: HTMLElement, { scales = [2, 3] }: Options={}) => {
    const ts = new TouchSimulator(el);
    const startX = 200;
    ts.start([{ x: 0, y: 0 }, { x: startX, y: 0 }]);
    scales.forEach(scale => {
        ts.move([{ x: 0, y: 0 }, { x: startX*scale, y: 0 }]);
    });
    ts.end();
};
