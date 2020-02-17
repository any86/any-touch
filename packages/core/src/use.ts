import AnyTouch from './index';
import Recognizer from '@any-touch/recognizer';
type C = typeof AnyTouch;
type I = InstanceType<C>;
/**
 * 触发dom事件
 * @param {C|I} AnyTouch对象或实例
 * @param {Recognizer} 识别器
 * @param {Object} 识别器参数
 */
export function use(instanceOrClass: C | I, Recognizer: new (...args: any) => Recognizer, options?: Record<string,any>): void {
    const name = options?.name;
    // 保证同一个事件只对应一个识别器
    if (void 0 !== name && void 0 !== instanceOrClass.recognizerMap[name]) return;
    const instance = new Recognizer(options);
    instanceOrClass.recognizerMap[instance.name] = instance;
    instance.recognizerMap = instanceOrClass.recognizerMap;
    instanceOrClass.recognizers.push(instanceOrClass.recognizerMap[instance.name]);
};

/**
 * 删除识别器
 * @param {C|I} AnyTouch对象或实例
 * @param {String} [手势名] 
 */
export function removeUse(instanceOrClass: C | I, recognizerName?: string): void {
    // 如果没有传入指定手势名称
    // 那么删除所有手势识别器
    if (void 0 === recognizerName) {
        instanceOrClass.recognizers = [];
        instanceOrClass.recognizerMap = {};
    } else {
        for (const [index, recognizer] of instanceOrClass.recognizers.entries()) {
            if (recognizerName === recognizer.options.name) {
                instanceOrClass.recognizers.splice(index, 1);
                delete instanceOrClass.recognizerMap[recognizerName];
                break;
            }
        }
    }
};
