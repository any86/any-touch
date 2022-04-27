import GestureSimulator from '../GestureSimulator';
import sleep from '../sleep';

import { Point } from '@any-touch/shared';
export default async function (el: HTMLElement, start: Point[], end: Point[]) {
    const gs = new GestureSimulator(el);
    gs.start(start);
    await sleep();
    gs.move(end);
    await sleep();
    gs.end();
};
