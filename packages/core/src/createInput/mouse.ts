import type { phase, PointClientXY } from '@any-touch/shared';
import { MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, TYPE_START, TYPE_MOVE, TYPE_END } from '../const';
import inputCreator from './inputCreator';
export default function (buttons: Set<number> = new Set([0])) {
    let prevPoints: PointClientXY[];
    let isPressed = false;
    // mousedown阶段的target,
    // 因为mousemove/end都绑定的window,
    // 所以需要对move/end阶段的target进行修改同步
    // 主要为了在事件委派这种模式下,
    // 可以正确的判断事件返回的target是否包含于_target中
    let _target: EventTarget | null = null;
    const createInput = inputCreator();
    return function (event: MouseEvent) {
        const { clientX, clientY, type, button, target } = event;

        // points中存target是为了多触点的时候校验target是否相同
        let points = [{ clientX, clientY, target }];
        let phase: phase | undefined;

        if (MOUSE_DOWN === type && buttons.has(button)) {
            _target = target;
            // 必须左键
            isPressed = true;
            phase = TYPE_START;
        } else if (isPressed) {
            if (MOUSE_MOVE === type) {
                phase = TYPE_MOVE;
            } else if (MOUSE_UP === type) {
                points = [];
                phase = TYPE_END;
                isPressed = false;
            }
        } else {
            return;
        }
        // changedPoints = prevPoints其实并不能完全等于touch下的changedPoints
        // 但是由于鼠标没有多点输入的需求,
        // 所以暂时如此实现
        const changedPoints = prevPoints || [{ clientX, clientY, target }];

        prevPoints = [{ clientX, clientY, target }];

        if (void 0 !== phase) {
            return createInput({
                phase,
                changedPoints,
                points,
                target: _target,
                targets: [_target],
                nativeEvent: event
            });
        }
    }
}
