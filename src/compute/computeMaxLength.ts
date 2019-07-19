import { Input } from '../interface';
import cache from '../$_cache';

export default ({ pointLength, isStart }: { pointLength:number, isStart:boolean}): number => {
    if (isStart) {
        cache.set({maxPointLength:pointLength});
        return pointLength;
    } else {
        const maxLength = cache.get('maxPointLength', 0);
        if (pointLength > maxLength) {
            cache.set({maxPointLength:pointLength});
        }

        return cache.get('maxPointLength', 0)
    }
};