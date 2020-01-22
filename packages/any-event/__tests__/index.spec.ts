import EventEmitter from '../src/index';

test('emit传递多个参数是否正确?', () => {
    const eventEmitter = new EventEmitter();
    const add = (n: number[]): number => n.reduce((prev: number, current: number) => {
        return prev + current;
    });
    eventEmitter.on('add', (...n: number[]) => {
        let result = add(n);
        expect(result).toBe(10);
    });
    eventEmitter.emit('add', 1, 2, 3, 4);
});


test('使用emit过滤"payload.a === 1"的事件?', (done) => {
    const mockFn = jest.fn();
    const eventEmitter = new EventEmitter();
    eventEmitter.on('add', ev => {
        mockFn(ev);
    }, ev => ev === 1);
    eventEmitter.emit('add', 1);
    eventEmitter.emit('add', 2);

    setTimeout(() => {
        expect(mockFn.mock.calls.length).toBe(1);
        done();
    }, 200)
});

test('off指定事假', () => {
    const eventEmitter = new EventEmitter();
    const mockCallback = jest.fn();
    eventEmitter.on('abc', mockCallback);
    eventEmitter.off('abc', mockCallback);
    eventEmitter.emit('abc');
    expect(mockCallback.mock.calls.length).toBe(0);
});


test('off所有对应的事件绑定', ()=>{
    const eventEmitter = new EventEmitter();
    const mockCallback = jest.fn();
    eventEmitter.on('abc', mockCallback);
    eventEmitter.off('abc');
    eventEmitter.emit('abc');
    expect(mockCallback.mock.calls.length).toBe(0);
});

// test('once是否正确?', () => {
//     const eventEmitter = new EventEmitter();
//     const mockCallback = jest.fn();
//     eventEmitter.once('abc', mockCallback);
//     eventEmitter.emit('abc');
//     eventEmitter.emit('abc');
//     expect(mockCallback.mock.calls.length).toBe(1);
// });


// test('off不指定listener运行是否正确?', () => {
//     const mockCallback = jest.fn();
//     const eventEmitter = new EventEmitter();
//     eventEmitter.on('abc', mockCallback);
//     eventEmitter.off('abc');
//     eventEmitter.emit('abc');
//     expect(mockCallback.mock.calls.length).toBe(0);
// });

// test('连续绑定相同事件, 事件触发次数是否正确?', ()=>{
//     const mockCallback = jest.fn();
//     const eventEmitter = new EventEmitter();
//     eventEmitter.on('abc', mockCallback);
//     eventEmitter.on('abc', mockCallback);
//     eventEmitter.emit('abc');
//     expect(mockCallback.mock.calls.length).toBe(2);
// });



test('destory是否生效?', () => {
    const mockCallback = jest.fn();
    const eventEmitter = new EventEmitter();
    eventEmitter.on('abc', mockCallback);
    eventEmitter.destroy();
    eventEmitter.emit('abc');
    expect(mockCallback.mock.calls.length).toBe(0);
});