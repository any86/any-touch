/**
 * 拷贝对象上的指定键值, 生成新的对象, 只拷贝第一层
 * @param {Object} 输入
 * @param {Array} 要复制的键值 
 * @return {Object} 输出
 */
export default <V, O extends Record<any, V>, K extends keyof O>(object: O, keys: K[]): Record<K, V> => {
    let _object = <Record<K, V>>{};
    for (let key of keys) {
        _object[key] = object[key];
    }
    return _object;
}

// type O = {a:number, b:string};
// type K = keyof O;

// type A = K[]
// type B = Record<K, any>
// let arr:A = ['a']