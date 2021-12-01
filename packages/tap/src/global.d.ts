import tap from './index';
/**
 * 扩展插件映射
 */
declare module '@any-touch/core' {
    interface PluginContextMap {
        tap: ReturnType<typeof tap>;
    }
}