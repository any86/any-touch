let lastClientX: number;
let lastClientY: number;
export function dispatchTouchStart(el: any, { x, y }: any) {
    let event: any = new Event('touchstart', {});
    event.touches = event.changedTouches = [{
        clientX: x,
        clientY: y,
    }];
    lastClientX = x;
    lastClientY = y;
    el.dispatchEvent(event);
}

export function dispatchTouchMove(el: any, { x, y }: any) {
    let event: any = new Event('touchmove', {});
    event.changedTouches = [{ clientX: lastClientX, clientY: lastClientY }]
    event.touches = [{
        clientX: x,
        clientY: y
    }];
    lastClientX = x;
    lastClientY = y;
    el.dispatchEvent(event);
};

export function dispatchTouchEnd(el: any) {
    let event: any = new Event('touchend', {});
    event.changedTouches = [{
        clientX: lastClientX,
        clientY: lastClientY
    }];

    event.touches = [];
    el.dispatchEvent(event);
}