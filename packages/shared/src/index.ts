export * from './is';
export * from './const';
export * from './types'
export function round2(n: number): number {
    return Math.round(n * 100) / 100;
}