import Tap from '@any-touch/tap';
import AnyTouch from '@any-touch/core';
import resetStatusForPressMoveLike from '../src/resetStatusForPressMoveLike'

test('set传递的参数如果未空, 那么不修改options(此处仅为了提高代码测试覆盖率)', () => {
    AnyTouch.use(Tap);
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const tap = at.get('tap');
    if(void 0 !== tap){
        const defaultOptions = tap.options;
        tap.set();
        expect(tap.options).toMatchObject(defaultOptions);
    };
});


test('resetStatusForPressMoveLike', () => {
    AnyTouch.use(Tap);
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const tap = at.get('tap');
    if(tap){
        tap.status = 'end'
        resetStatusForPressMoveLike(tap)
        expect(tap.status).toBe('p')
    }
});



