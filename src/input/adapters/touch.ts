export default (event: TouchEvent): any => {
    // const pointers = event.targetTouches;
    const pointers = Array.from(event.touches).map(({clientX,clientY})=>({clientX,clientY}));
    const changedPointers = Array.from(event.changedTouches).map(({clientX,clientY})=>({clientX,clientY}));
    const eventType = event.type.replace('touch', '');
    return {
        eventType,
        changedPointers,
        pointers,
        nativeEvent: event,
    };
}; 