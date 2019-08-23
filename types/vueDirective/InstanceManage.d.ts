export default class<T extends {
    new (...arys: any): any;
}> {
    stock: {
        el: HTMLElement;
        instance: InstanceType<T>;
    }[];
    ClassObject: T;
    constructor(ClassObject: T);
    getIndexByEl(el: HTMLElement): number;
    getInstanceByIndex(index: number): InstanceType<T>;
    removeInstanceByIndex(index: number): void;
    getOrCreateInstanceByEl(el: HTMLElement): InstanceType<T>;
}
