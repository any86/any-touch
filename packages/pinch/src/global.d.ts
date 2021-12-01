import pinch from './index';
/**
 * 扩展插件映射
 */
declare module '@any-touch/core' {
    interface PluginContextMap {
        pinch: ReturnType<typeof pinch>;
    }
}