import AnyTouch from './index';
type AnyTouchPlugin = any;
type C = typeof AnyTouch;
type I = InstanceType<C>;
/**
 * 触发dom事件
 */
export function use(instanceOrClass: C | I, plugin: AnyTouchPlugin, options?: Record<string, any>): void {
    if ('Recognizer' === plugin.type) {
        const instance = new plugin(options);
        instanceOrClass.recognizerMap[instance.name] = instance;
        instanceOrClass.recognizers.push(instanceOrClass.recognizerMap[instance.name]);
    } else {
        instanceOrClass.plugins.push(plugin);
    }
};

export function removeUse(instanceOrClass: C | I, recognizerName: string): void {
    for (const [index, recognizer] of instanceOrClass.recognizers.entries()) {
        if (recognizerName === recognizer.options.name) {
            instanceOrClass.recognizers.splice(index, 1);
            delete instanceOrClass.recognizerMap[recognizerName];
            break;
        }
    }
};
