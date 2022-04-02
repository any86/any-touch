export * from './const';
export * from './types'
export * from './pressMoveFlow'
export * from './createPluginContext'
export function round2(n: number): number {
    return Math.round(n * 100) / 100;
}