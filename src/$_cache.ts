class _Cache {
    private _cache: { [k: string]: any };

    constructor() {
        this._cache = {};
    }

    set(object:object){
        this._cache = {...this._cache, ...object};
    };

    get<T>(key: string,defaultValue?:T):T{
        return this._cache[key] || defaultValue;
    };

    reset() {
        this._cache = {};
    }
}

export default new _Cache();

