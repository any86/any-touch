const ObjectToString = Object.prototype.toString;

export function isRegExp(input: any): input is RegExp {
    return '[object RegExp]' === ObjectToString.call(input);
}

export function isFunction(input: any): input is Function {
    return '[object Function]' === ObjectToString.call(input);
}