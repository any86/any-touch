import swipe from './index';
/**
 * 扩展插件映射
 */
declare module '@any-touch/core' {
    interface PluginContextMap {
        swipe: ReturnType<typeof swipe>;
    }
}