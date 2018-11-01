export default (event: TouchEvent): any => {
    // const pointers = event.targetTouches;
    const pointers = event.touches;
    const changedPointers = event.changedTouches;
    const inputStatus = event.type.replace('touch', '');
    const type = (0 < pointers.length && changedPointers.length !== pointers.length) ?
        `input-change-length` :
        `input-${inputStatus}`;
    return {
        type,
        inputStatus,
        changedPointers,
        pointers,
        nativeEvent: event,
    };
}; 