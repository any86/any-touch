import canPreventDefault from '../src/canPreventDefault';
test('isPreventDefaul=false, 那么canPreventDefault === false', () => {
    const event = new TouchEvent('touchstart', { cancelable: true });
    expect(canPreventDefault(event, { isPreventDefault: false })).toBeFalsy();
});


test('通过"preventDefaultExclude"排除div元素不执行preventDefault', () => {
    const options = {
        isPreventDefault: false,
        preventDefaultExclude(ev:any) {
            return 'div' === ev.target.tagName;
        }
    };
    expect(canPreventDefault({ target: { tagName: 'div' } } as any, options)).toBeFalsy();
});