export default (event: TouchEvent): any => {
    // const pointers = event.targetTouches;
    const pointers = event.touches;
    const changedPointers = event.changedTouches;
    const inputStatus = event.type.replace('touch', '');
    return {
        inputStatus,
        changedPointers,
        pointers,
        nativeEvent: event,
    };
}; 