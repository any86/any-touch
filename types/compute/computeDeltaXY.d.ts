import { Store, InputRecord } from '../interface';
export default function ({ prevInput, input }: InputRecord, $store: Store): {
    deltaX: number;
    deltaY: number;
    deltaXYAngle: number;
};
