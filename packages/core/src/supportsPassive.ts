// 校验是否支持passive
let supportsPassive = false;
try {
    const opts = {};
    Object?.defineProperty(opts, 'passive', ({
        get() {
            supportsPassive = true;
        }
    }));
    if ('test' === process.env.NODE_ENV) {
        (opts as any).passive
    } else {
        /* istanbul ignore next */
        // jest这样不会读取opts.passive
        window.addEventListener('_', () => void 0, opts);
    }
} catch { }

export default () => supportsPassive;