import Core from '@any-touch/core';
import { STATE, AnyTouchEvent } from '@any-touch/shared';
import tap from '@any-touch/tap';
declare module '@any-touch/core' {
    export interface PluginContextMap {
        doubletap: ReturnType<typeof tap>;
    }

    export interface EventMap {
        doubletap: AnyTouchEvent;
    }
}
import { GestureSimulator, sleep } from '@any-touch/simulator';
import debounce from 'lodash/debounce';
test(`tap延迟300ms触发, 如果届时doubletap状态为"失败或可能"那么触发tap`, async (done) => {
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const at = new Core(el);
    at.use(tap);
    at.use(tap, { name: 'doubletap', tapTimes: 2 });
    const onTap = jest.fn();
    const onDoubleTap = jest.fn();
    at.beforeEach((pluginContext, next) => {
        if ('tap' === pluginContext.name) {
            debounce(() => {
                const doubletap = at.get('doubletap');
                if ([STATE.POSSIBLE, STATE.FAILED].includes(doubletap!.state)) next();
            }, 300);
        } else {
            next();
        }
    });
    const b = at.get('rotate')

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
