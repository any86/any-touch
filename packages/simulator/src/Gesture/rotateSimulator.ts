import TouchSimulator from '../GestureSimulator';
interface Options {
    angles: number[];
};
export default function (el: Element, { angles = [5,15,25]}: Options = <Options>{}) {
    let ts = new TouchSimulator(el);
    let x = 3;
    ts.dispatchTouchStart([{ x: 0, y: 0 }, { x, y: 0 }]);
    let step = angles.length;
    for (let i = 0; i < step; i++) {
        let angle = angles[i];
        let radEachStep = angle * Math.PI / 180;
        let y = x * Math.tan(radEachStep);
        ts.dispatchTouchMove([
            { x: 0, y: 0 }, 
            { x, y}
        ]);
    }
    ts.dispatchTouchEnd();
};