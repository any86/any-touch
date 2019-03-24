export default (event: TouchEvent): any => {
    // const points = event.targetTouches;
    const points = Array.from(event.touches).map(({clientX,clientY})=>({clientX,clientY}));
    const changedPointers = Array.from(event.changedTouches).map(({clientX,clientY})=>({clientX,clientY}));
    const eventType = event.type.replace('touch', '');
    return {
        eventType,
        changedPointers,
        points,
        nativeEvent: event,
    };
}; 