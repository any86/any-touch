export default (event: TouchEvent): any => {
    const SOURCE_TYPE: string = 'touch';
    const { type } = event;
    const inputState = type.replace(SOURCE_TYPE, '');
    // const pointers = event.targetTouches;
    const pointers = event.touches;
    const changedPointers = event.changedTouches;

    return {
        inputState,
        changedPointers,
        pointers,
        nativeEvent: event,
    };
};