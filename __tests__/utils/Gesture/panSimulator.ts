import TouchSimulator from '../TouchSimulator';
interface Options {
    direction?: string;
};
export default (el: Element, { direction = 'up' }: Options = {}) => {
    const ts = new TouchSimulator(el);
    ts.dispatchTouchStart([{ x: 100, y: 100 }]);
    // move
    for (let i = 0; i < 20; i++) {
        if('up' === direction) {
            ts.dispatchTouchMove([{ x: 100, y: 0 }]);
        } else if('right' === direction) {
            ts.dispatchTouchMove([{ x: 200, y: 100 }]);
        }else if('down' === direction) {
            ts.dispatchTouchMove([{ x: 100, y: 200 }]);
        }else if('left' === direction) {
            ts.dispatchTouchMove([{ x: 0, y: 100 }]);
        }
    }
    // end
    ts.dispatchTouchEnd();
};
