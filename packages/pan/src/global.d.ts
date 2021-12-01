import pan from './index';
/**
 * 扩展插件映射
 */
declare module '@any-touch/core' {
    interface PluginContextMap {
        pan: ReturnType<typeof pan>;
    }
}