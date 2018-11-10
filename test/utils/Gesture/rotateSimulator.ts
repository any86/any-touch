import TouchSimulator from '../TouchSimulator';
interface Options {
    angles: number[];
};
export default function (el: Element, { angles = [5,15,25]}: Options = <Options>{}) {
    let ts = new TouchSimulator();
    let x = 3;
    ts.dispatchTouchStart(el, [{ x: 0, y: 0 }, { x, y: 0 }]);
    let step = angles.length;
    for (let i = 0; i < step; i++) {
        let angle = angles[i];
        let radEachStep = angle * Math.PI / 180;
        let y = x * Math.tan(radEachStep);
        ts.dispatchTouchMove(el, [
            { x: 0, y: 0 }, 
            { x, y}
        ]);
    }
    ts.dispatchTouchEnd(el);
};