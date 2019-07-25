class Store {
    store: Record<string, any>;

    constructor() {
        this.store = {};
    }

    set(object: object) {
        this.store = { ...this.store, ...object };
    };

    get<T>(key: string, defaultValue?: T): T {
        return this.store[key] || defaultValue;
    };

    reset() {
        this.store = {};
    }
}

export default new Store();