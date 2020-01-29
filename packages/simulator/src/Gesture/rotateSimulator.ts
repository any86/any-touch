import TouchSimulator from '../GestureSimulator';
export default function (el: HTMLElement,angles = [5, 15, 25]) {
    const ts = new TouchSimulator(el);
    const R = 3;
    // start
    ts.dispatchTouchStart([{ x: 0, y: 0 }, { x: R, y: 0 }]);

    // move
    angles.forEach(angle => {
        const radEachStep = angle * Math.PI / 180;
        const y = R * Math.tan(radEachStep);
        ts.dispatchTouchMove([
            { x: 0, y: 0 },
            { x: R, y }
        ]);
    });

    // end
    ts.dispatchTouchEnd();
};