// export default function<T=number>(fn:(...args:any[])=>any, id:T){
//     const _map:{[k:T]:any} = {1:2};
//     const value = _map[id];
// }

/**
 * 简单的惰性计算
 * @param {Function} 输入函数 
 * @param {Number} input的id, 用来做缓存的减值
 * @param
 */
export default function (fn: (...args: any[]) => any, id: number) {
    let _map: { [k: number]: any } = {};
    return (...args: any[]) => {
        const value = _map[id];
        if (void 0 === value) {
            console.warn('计算');
            _map = {
                [id]: fn(...args)
            };
            return _map[id];
        } else {
            console.log('缓存');
            return value;
        }
    }
}