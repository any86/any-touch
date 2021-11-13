import Tap from '@any-touch/tap';
import Core from '@any-touch/core';
import resetStatusForPressMoveLike from '../src/resetStatusForPressMoveLike'

test('set传递的参数如果未空, 那么不修改options(此处仅为了提高代码测试覆盖率)', () => {
    Core.use(Tap);
    const el = document.createElement('div');
    const at = new Core(el);
    const tap = at.get('tap');
    if(void 0 !== tap){
        const defaultOptions = tap.options;
        tap.set();
        expect(tap.options).toMatchObject(defaultOptions);
    };
});


test('resetStatusForPressMoveLike', () => {
    Core.use(Tap);
    const el = document.createElement('div');
    const at = new Core(el);
    const tap = at.get('tap');
    if(tap){
        tap.status = 'end'
        resetStatusForPressMoveLike(tap)
        expect(tap.status).toBe('p')
    }
});



