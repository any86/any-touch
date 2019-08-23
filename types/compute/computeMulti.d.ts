import { Input } from '../interface';
import Store from '../Store';
declare type Arg = {
    startMultiInput?: Input;
    prevInput?: Input;
    input: Input;
};
declare type Ret = {
    scale: number;
    deltaScale: number;
    angle: number;
    deltaAngle: number;
};
export default function ({ startMultiInput, prevInput, input }: Arg, $store: Store): Ret;
export {};
