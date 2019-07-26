import Store from '../Store';

export default ({ pointLength, isStart }: { pointLength:number, isStart:boolean}, $store:Store): number => {
    if (isStart) {
        $store.set({maxPointLength:pointLength});
        return pointLength;
    } else {
        const maxLength = $store.get('maxPointLength', 0);
        if (pointLength > maxLength) {
            $store.set({maxPointLength:pointLength});
        }

        return $store.get('maxPointLength', 0)
    }
};