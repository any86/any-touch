/**
 * "-"格式转成驼峰格式
 * @param {String} 输入 
 * @return {String} 输出
 */
export default (string: string): string=> {
    var camelizeRE = /-(\w)/g;
    return string.replace(camelizeRE, word => {
        return word.toLocaleUpperCase().slice(1)
    });
}