import GestureSimulator from '../GestureSimulator';
import { Point, directionString } from '@any-touch/shared';
type MoveInfo = { distance: number, direction: 'up' | 'down' | 'right' | 'left' };

function parseMoveInfo({ x, y }: Point, { distance, direction }: MoveInfo):Point {
    const map = {
        up: { x, y: y - distance },
        left: { x: x - distance, y },
        down: { x, y: y + distance },
        right: { x: x + distance, y }
    };
    return map[direction];
}

export default (el: Element, moveInfo: MoveInfo = { distance: 10, direction: 'up' }, startPoint = { x: 0, y: 0 }) => {
    const gs = new GestureSimulator(el);
    gs.dispatchTouchStart([startPoint]);
    gs.dispatchTouchMove([parseMoveInfo(startPoint, moveInfo)]);
    return gs.dispatchTouchEnd();
};
