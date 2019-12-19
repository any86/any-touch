import EventEmitter from '../src/main';
test('has是否正确?', () => {
    const eventEmitter = new EventEmitter();
    const mockCallback = jest.fn();
    eventEmitter.on('abc', mockCallback);
    expect(eventEmitter.has('abc')).toBeTruthy();
    expect(eventEmitter.has('def')).toBeFalsy();
});


test('emit传递多个参数是否正确?', () => {
    const eventEmitter = new EventEmitter();
    const add = (n:number[]): number => n.reduce((prev: number, current: number) => {
        return prev + current;
    });
    eventEmitter.on('add', (...n:number[]) => {
        let result = add(n);
        expect(result).toBe(10);
    });
    eventEmitter.emit('add', 1, 2, 3, 4);
});

test('off是否正确?', () => {
    const eventEmitter = new EventEmitter();
    const mockCallback = jest.fn();
    eventEmitter.on('abc', mockCallback);
    eventEmitter.off('abc', mockCallback);
    // 解绑不存在的事件def, 仅仅为了增加代码覆盖率
    eventEmitter.off('def', mockCallback);
    eventEmitter.emit('abc');
    expect(mockCallback.mock.calls.length).toBe(0);
});

test('once是否正确?', () => {
    const eventEmitter = new EventEmitter();
    const mockCallback = jest.fn();
    eventEmitter.once('abc', mockCallback);
    eventEmitter.emit('abc');
    eventEmitter.emit('abc');
    expect(mockCallback.mock.calls.length).toBe(1);
});


test('off不指定listener运行是否正确?', () => {
    const mockCallback = jest.fn();
    const eventEmitter = new EventEmitter();
    eventEmitter.on('abc', mockCallback);
    eventEmitter.off('abc');
    eventEmitter.emit('abc');
    expect(mockCallback.mock.calls.length).toBe(0);
});

test('连续绑定相同事件, 事件触发次数是否正确?', ()=>{
    const mockCallback = jest.fn();
    const eventEmitter = new EventEmitter();
    eventEmitter.on('abc', mockCallback);
    eventEmitter.on('abc', mockCallback);
    eventEmitter.emit('abc');
    expect(mockCallback.mock.calls.length).toBe(2);
});

test('getEventNames是否正确返回所有事件名?', ()=>{
    const mockCallback = jest.fn();
    const eventEmitter = new EventEmitter();
    eventEmitter.on('tap', mockCallback);
    eventEmitter.on('pan', mockCallback);
    eventEmitter.on('pinch', mockCallback);
    expect(eventEmitter.eventNames().length).toBe(3);
    expect(eventEmitter.getEventNames()).toContain('tap');
    expect(eventEmitter.getEventNames()).toContain('pan');
    expect(eventEmitter.getEventNames()).toContain('pinch');
});


test('destory是否生效?', ()=>{
    const mockCallback = jest.fn();
    const eventEmitter = new EventEmitter();
    eventEmitter.on('abc', mockCallback);
    eventEmitter.destroy();
    eventEmitter.emit('abc');
    expect(mockCallback.mock.calls.length).toBe(0);
});