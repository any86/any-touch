export default (event: TouchEvent): any => {
    const SOURCE_TYPE: string = 'touch';
    const { type } = event;
    const inputStatus = type.replace(SOURCE_TYPE, '');
    // const pointers = event.targetTouches;
    const pointers = event.touches;
    const changedPointers = event.changedTouches;

    return {
        inputStatus,
        changedPointers,
        pointers,
        nativeEvent: event,
    };
};