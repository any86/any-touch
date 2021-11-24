import canPreventDefault from '../src/canPreventDefault';
import { DEFAULT_OPTIONS } from '@any-touch/core';
test('isPreventDefaul=false, 那么canPreventDefault === false', () => {
    const event = new TouchEvent('touchstart', { cancelable: true });
    expect(canPreventDefault(event, { preventDefault: false })).toBeFalsy();
});


test('通过"preventDefault"排除div元素不执行preventDefault', () => {
    const options = {
        preventDefault(ev: any) {
            return 'DIV' !== ev.target.tagName;
        }
    };
    expect(canPreventDefault({ target: { tagName: 'DIV' } } as any, options)).toBeFalsy();
});


test('通过"preventDefault"排除span元素不执行preventDefault, 但是当前元素是div', () => {
    const options = {
        preventDefault(e: any) {
            return 'SPAN' !== e.target.tagName;
        }
    };
    expect(canPreventDefault({ target: { tagName: 'DIV' } } as any, options)).toBeTruthy();
});

test('null === target时, 不进行阻止默认排除操作', () => {
    expect(canPreventDefault({ target: null } as any, DEFAULT_OPTIONS)).toBeFalsy();
});

// test('通过正则来过滤"阻止默认"元素', () => {
//     const options = {
//         preventDefault: true,
//         preventDefault: /^(?:INPUT|TEXTAREA|BUTTON|SELECT)$/
//     };
//     expect(canPreventDefault({ target: { tagName: 'INPUT' } } as any, options)).toBeFalsy();
// });

test('默认情况下, 非表单元素都会被组织默认事件', () => {
    expect(canPreventDefault({ target: { tagName: 'div' } } as any, DEFAULT_OPTIONS)).toBeTruthy();
});


test('preventDefault为空', () => {
    expect(canPreventDefault({ target: { tagName: 'INPUT' } } as any, {})).toBeFalsy();
});