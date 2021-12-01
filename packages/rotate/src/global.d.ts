import rotate from './index';
/**
 * 扩展插件映射
 */
declare module '@any-touch/core' {
    interface PluginContextMap {
        rotate: ReturnType<typeof rotate>;
    }
}