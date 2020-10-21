import GestureSimulator from '../GestureSimulator';
import { Point } from '@any-touch/shared';
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

export default (el: HTMLElement, moveInfo: MoveInfo = { distance: 10, direction: 'up' }, startPoint = { x: 0, y: 0 }) => {
    const gs = new GestureSimulator(el);
    gs.start([startPoint]);
    gs.move([parseMoveInfo(startPoint, moveInfo)]);
    return gs.end();
};
