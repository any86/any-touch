export default class {
    constructor() {

    };

    load(event: TouchEvent): any {
        const points = Array.from(event.touches).map(({ clientX, clientY }) => ({ clientX, clientY }));
        const changedPoints = Array.from(event.changedTouches).map(({ clientX, clientY }) => ({ clientX, clientY }));
        const eventType = event.type.replace('touch', '');
        return {
            eventType,
            changedPoints,
            points,
            nativeEvent: event
        };
    }
}; 