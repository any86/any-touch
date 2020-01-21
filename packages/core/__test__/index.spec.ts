import AT from '../src/index';

test('emit传递多个参数是否正确?', () => {
    expect(AT.version).toBe('__VERSION__')
});