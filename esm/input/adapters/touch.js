export default (event) => {
    const SOURCE_TYPE = 'touch';
    const { type } = event;
    const nativeEventType = type.replace(SOURCE_TYPE, '');
    const pointers = event.touches;
    const changedPointers = event.changedTouches;
    return {
        nativeEventType,
        changedPointers,
        pointers,
        nativeEvent: event,
    };
};
