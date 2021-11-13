import Core from '@any-touch/core';
import { STATUS_POSSIBLE, STATUS_FAILED } from '@any-touch/shared';

import Tap from '@any-touch/tap';
import { GestureSimulator, sleep } from '@any-touch/simulator';
import debounce from 'lodash/debounce'
test(`tap延迟300ms触发, 如果届时doubletap状态为"失败或可能"那么触发tap`, async (done) => {
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const at = new Core(el);
    at.use(Tap);
    at.use(Tap, { name: 'doubletap', tapTimes: 2 });
    const onTap = jest.fn();
    const onDoubleTap = jest.fn();
    at.beforeEach(({ name }, map, next) => {
        if ('tap' === name) {
            debounce(() => {
                if ([STATUS_POSSIBLE, STATUS_FAILED].includes(map.doubletap.status)) next();
            }, 300);
        } else {
            next();
        }
    });
    at.on('tap', onTap);
    at.on('doubletap', onDoubleTap);

    gs.start();
    gs.end();
    gs.start();
    gs.end();
    await sleep(310);
    expect(onTap).toHaveBeenCalledTimes(0);
    expect(onDoubleTap).toHaveBeenCalledTimes(1);
    await sleep();
    done();
});