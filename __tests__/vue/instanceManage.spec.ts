import InstanceManage from '../../src/vueDirective/InstanceManage';
class ABC {
    a: number;

    constructor() {
        this.a = 1;
    };

    setA(v: number) {
        this.a = v;
    }

    getA() {
        return this.a;
    }
};


const el = document.createElement('div');
const im = new InstanceManage(ABC);

test('getInstanceByIndex', () => {
    im.getOrCreateInstanceByEl(el);
    const instance = im.getInstanceByIndex(0);
    expect(instance).toBeDefined();
    expect(instance instanceof ABC).toBeTruthy();
});

test('removeInstanceByIndex', () => {
    im.removeInstanceByIndex(0);
    expect(im.stock.length).toBe(0);
});

test('getIndexByEl, 如果元素存在返回索引, 不存在返回-1', () => {
    const index = im.getIndexByEl(el);
    expect(index).toBe(-1);

    // 新建
    im.getOrCreateInstanceByEl(el);
    expect(im.getIndexByEl(el)).toBe(0);
    expect(im.stock.length).toBe(1);

    // get
    im.getOrCreateInstanceByEl(el);
    expect(im.stock.length).toBe(1);
});
