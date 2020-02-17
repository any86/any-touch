import canPreventDefault from '../src/canPreventDefault';
test('isPreventDefaul=false, 那么canPreventDefault === false', () => {
    const event = new TouchEvent('touchstart', { cancelable: true });
    expect(canPreventDefault(event, { isPreventDefault: false })).toBeFalsy();
});


test('通过"preventDefaultExclude"排除div元素不执行preventDefault', () => {
    const options = {
        isPreventDefault: true,
        preventDefaultExclude(ev: any) {
            return 'DIV' === ev.target.tagName;
        }
    };
    expect(canPreventDefault({ target: { tagName: 'DIV' } } as any, options)).toBeFalsy();
});


test('通过"preventDefaultExclude"排除span元素不执行preventDefault, 但是当前元素是div', () => {
    const options = {
        isPreventDefault: true,
        preventDefaultExclude(ev: any) {
            return 'SPAN' === ev.target.tagName;
        }
    };
    expect(canPreventDefault({ target: { tagName: 'DIV' } } as any, options)).toBeTruthy();
});

test('null === target时, 不进行阻止默认排除操作', () => {
    const options = {
        isPreventDefault: true,
        preventDefaultExclude(ev: any) {
            return 'SPAN' === ev.target.tagName;
        }
    };
    expect(canPreventDefault({ target: null } as any, options)).toBeTruthy();
});

test('通过正则来过滤"阻止默认"元素', () => {
    const options = {
        isPreventDefault: true,
        preventDefaultExclude: /^(?:INPUT|TEXTAREA|BUTTON|SELECT)$/
    };
    expect(canPreventDefault({ target: { tagName: 'INPUT' } } as any, options)).toBeFalsy();
});

test('没有tagName的event不进行过滤"阻止默认"元素', () => {
    const options = {
        isPreventDefault: true,
        preventDefaultExclude: /^(?:INPUT|TEXTAREA|BUTTON|SELECT)$/
    };
    expect(canPreventDefault({ target: {} } as any, options)).toBeTruthy();
});


test('preventDefaultExclude既不是正则也不是函数', () => {
    const options = {
        isPreventDefault: true,
        preventDefaultExclude:123
    };
    expect(canPreventDefault({ target:{ tagName: 'INPUT' } } as any, options as any)).toBeTruthy();
});