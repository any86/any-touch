import AnyTouch from 'any-touch';
test('检查AnyTouch上属性是否完整', ()=>{
    expect(AnyTouch).toHaveProperty('Tap');
    expect(AnyTouch).toHaveProperty('Pan');
    expect(AnyTouch).toHaveProperty('Swipe');
    expect(AnyTouch).toHaveProperty('Pinch');
    expect(AnyTouch).toHaveProperty('Rotate');
    expect(AnyTouch).toHaveProperty('Press');
    expect(AnyTouch).toHaveProperty('STATUS_POSSIBLE');
    expect(AnyTouch).toHaveProperty('STATUS_START');
    expect(AnyTouch).toHaveProperty('STATUS_MOVE');
    expect(AnyTouch).toHaveProperty('STATUS_END');
    expect(AnyTouch).toHaveProperty('STATUS_CANCELLED');
    expect(AnyTouch).toHaveProperty('STATUS_FAILED');
    expect(AnyTouch).toHaveProperty('STATUS_RECOGNIZED');
});