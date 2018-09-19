export default (event: TouchEvent): any => {
    const SOURCE_TYPE: string = 'touch';
    const { type } = event;
    const status = type.replace(SOURCE_TYPE, '');
    const pointers = event.touches;
    const changedPointers = event.changedTouches;
    return {
        status,
        changedPointers,
        pointers,
        sourceEvent: event,
    }
}