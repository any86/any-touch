/**
 * 拷贝对象上的指定键值, 生成新的对象, 只拷贝第一层
 * @param {Object} 输入
 * @param {Array} 要复制的键值 
 * @return {Object} 输出
 */
export default <O, K extends keyof O>(object: O, keys: K[]): Record<K, any> => {
    let _object = <Record<K, any>>{};
    for (let key of keys) {
        _object[key] = object[key];
    }
    return _object;
}

// type O = { a: number, b: string };
// type K = keyof O;

// type A = K[]
// type B = Record<K, any>
// // let arr:A = ['a']