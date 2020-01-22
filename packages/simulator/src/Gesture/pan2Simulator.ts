import TouchSimulator from '../GestureSimulator';
import sleep from '../sleep';
interface Options {
    direction?: string;
};
export default (el: Element, { direction = 'up' }: Options = {}) => {
    const ts = new TouchSimulator(el);
    const MAX = 100;
    const INTERVAL_TIME = 50;
    // move
    if ('up' === direction) {
        ts.dispatchTouchStart([{ x: 0, y: MAX }, { x: 1, y: MAX }]);
        for (let i = 1; i < 10; i++) {
            sleep(INTERVAL_TIME * i).then(() => {
                ts.dispatchTouchMove([{ x: 0, y: MAX - i * 10 }, { x: 1, y: MAX - i * 10 }]);
                if(9 === i) {
                    ts.dispatchTouchEnd();
                }
            });
        }
    } else if ('right' === direction) {
        ts.dispatchTouchStart([{ x: 0, y: 0 }, { x: 0, y: 1 }]);
        for (let i = 1; i < 10; i++) {
            sleep(INTERVAL_TIME * i).then(() => {
                ts.dispatchTouchMove([{ x: i * 10, y: 0 }, { x: i * 10, y: 1}]);
                if(9 === i) {
                    ts.dispatchTouchEnd();
                }
            });
        }
    } else if ('down' === direction) {
        ts.dispatchTouchStart([{ x: 0, y: 0 }, { x: 1, y: 0 }]);
        for (let i = 1; i < 10; i++) {
            sleep(INTERVAL_TIME * i).then(() => {
                ts.dispatchTouchMove([{ x: 0, y: i * 10 }, { x: 1, y: i * 10 }]);
                if(9 === i) {
                    ts.dispatchTouchEnd();
                }
            });
        }

    } else if ('left' === direction) {
        ts.dispatchTouchStart([{ x: MAX, y: 0 }, { x: MAX, y: 1 }]);
        for (let i = 1; i < 10; i++) {
            sleep(INTERVAL_TIME * i).then(() => {
                ts.dispatchTouchMove([{ x: MAX - i * 10, y:0  }, { x: MAX - i * 10, y:1 }]);
                if(9 === i) {
                    ts.dispatchTouchEnd();
                }
            });
        }
    }
    // end
    
};
