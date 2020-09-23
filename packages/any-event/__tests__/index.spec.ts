import AnyEvent from '../src/index';

test('off指定事件', () => {
    const [on, off,emit] = AnyEvent();
    const mockCallback = jest.fn();
    on('abc', mockCallback);
    off('abc', mockCallback);
    emit('abc');
    expect(mockCallback.mock.calls.length).toBe(0);
});


test('off所有对应的事件绑定', ()=>{
    const [on, off,emit] = AnyEvent();
    const mockCallback = jest.fn();
    on('abc', mockCallback);
    off('abc');
    emit('abc');
    expect(mockCallback.mock.calls.length).toBe(0);
});

// test('once是否正确?', () => {
//     const eventEmitter = AnyEvent();
//     const mockCallback = jest.fn();
//     once('abc', mockCallback);
//     emit('abc');
//     emit('abc');
//     expect(mockCallback.mock.calls.length).toBe(1);
// });


// test('off不指定listener运行是否正确?', () => {
//     const mockCallback = jest.fn();
//     const eventEmitter = AnyEvent();
//     on('abc', mockCallback);
//     off('abc');
//     emit('abc');
//     expect(mockCallback.mock.calls.length).toBe(0);
// });

// test('连续绑定相同事件, 事件触发次数是否正确?', ()=>{
//     const mockCallback = jest.fn();
//     const eventEmitter = AnyEvent();
//     on('abc', mockCallback);
//     on('abc', mockCallback);
//     emit('abc');
//     expect(mockCallback.mock.calls.length).toBe(2);
// });



test('destory是否生效?', () => {
    const mockCallback = jest.fn();
    const [on,off,emit,destroy] = AnyEvent();
    on('abc', mockCallback);
    destroy();
    emit('abc');
    expect(mockCallback.mock.calls.length).toBe(0);
});