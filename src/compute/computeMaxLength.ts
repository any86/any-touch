import Store from '../Store';

export default ({ pointLength, isStart }: { pointLength: number, isStart: boolean }, $store: Store): number => {
    if (isStart) {
        $store.set({ maxPointLength: pointLength });
        return pointLength;
    }
    return $store.get('maxPointLength', 0)
};