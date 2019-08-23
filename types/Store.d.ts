export default class {
    store: Record<string, any>;
    constructor();
    set(object: object): void;
    get<T>(key: string, defaultValue?: T): T;
    reset(): void;
    destroy(): void;
}
