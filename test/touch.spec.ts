import touch from '../src/input/adapters/touch'

test('touch input ok?', () => {
    let event1: any = new Event('touchstart', {});
    event1.touches = event1.changedTouches = [{
        clientX: 0,
        clientY: 0,
    }];

    let { nativeEventType,
        changedPointers,
        pointers,
        nativeEvent } = touch(event1);
    expect(nativeEventType).toBe('start');
    expect(changedPointers).toHaveLength(1);

});