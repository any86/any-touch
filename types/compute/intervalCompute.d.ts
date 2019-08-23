import { Input } from '../interface';
import Store from '../Store';
declare const _default: ({ prevInput, input }: {
    prevInput?: Input | undefined;
    input?: Input | undefined;
}, $store: Store) => {
    speedX: number;
    speedY: number;
    velocityX: number;
    velocityY: number;
    direction?: "left" | "right" | "none" | "up" | "down" | undefined;
};
export default _default;
