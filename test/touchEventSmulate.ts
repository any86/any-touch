export function dispatchTouchStart(el: any, {x,y}:any) {
    let event1: any = new Event('touchstart', {});
    event1.touches = event1.changedTouches = [{
        clientX: x,
        clientY: y,
    }];
    el.dispatchEvent(event1);
}

export function dispatchTouchMove(el: any, { x, y }: any) {
    let event2: any = new Event('touchmove', {});
    event2.touches = event2.changedTouches = [{
        clientX: x,
        clientY: y
    }];
    el.dispatchEvent(event2);
};

export function dispatchTouchEnd(el: any, { x, y }: any) {
    let event3: any = new Event('touchend', {});
    event3.touches = event3.changedTouches = [{
        clientX: x,
        clientY: y
    }];
    el.dispatchEvent(event3);
}