import press from './index';
/**
 * 扩展插件映射
 */
declare module '@any-touch/core' {
    interface PluginContextMap {
        press: ReturnType<typeof press>;
    }
}