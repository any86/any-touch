import computeTouchAction from '../src/utils/computeTouchAction';
test('touchAction计算是否正确?', () => {
    {
        let css = computeTouchAction(['pan-x', 'auto']);
        expect(css).toBe('pan-x');
    }

    {
        let css = computeTouchAction(['none', 'pan-x', 'pan-x']);
        expect(css).toBe('none');
    }

    {
        let css = computeTouchAction(['auto', 'pan-x', 'pan-y']);
        expect(css).toBe('pan-x pan-y');
    }
});