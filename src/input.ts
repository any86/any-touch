import { InputComputed, AnyTouch } from './interface';
import InputFactory from './InputFactory';
import session from './session';
import compute from './compute';
import mouseInput from './input/mouse'
export default function (event: any): any {
    let pointers;
    let length;
    let changedPointers;
    if ('ontouchstart' in window) {
        switch (event.type) {
            case 'touchstart':
                session.isStart = true;
                session.isEnd = session.isMove = false;
                break;

            case 'touchmove':
                session.isMove = true;
                session.isEnd = session.isStart = false;
                break;

            case 'touchend':
                session.isEnd = true;
                session.isMove = session.isStart = false;
                break;
        }
        pointers = event.touches;
        length = pointers.length;
        changedPointers = event.changedTouches;
    } else {
        switch (event.type) {
            case 'mousedown':
                session.isStart = true;
                session.isEnd = session.isMove = false;
                break;

            case 'mousemove':
                session.isMove = true;
                session.isEnd = session.isStart = false;
                break;

            case 'mouseup':
                session.isEnd = true;
                session.isMove = session.isStart = false;
                break;
        }

        const mouse = mouseInput(event);
        if(undefined === mouse) return;
        pointers = mouse.pointers;
        length = mouse.length;
        changedPointers = mouse.changedPointers;
    }

    // [Start]
    if (session.isStart) {
        // 清空缓存的多点起点数据
        session.startMultiInput = undefined;
        // 起点(单点|多点)
        session.startInput = new InputFactory(pointers);
        // 上一步的触点
        session.prevInput = undefined;
        // 当前触碰点
        session.input = new InputFactory(pointers);
    }
    // [Move]
    else if (session.isMove) {
        // 上一步的触点
        session.prevInput = session.input;
        // 当前触碰点
        session.input = new InputFactory(pointers);
    }
    // [End]
    else if (session.isEnd) {
        session.endInput = new InputFactory(changedPointers);
    }

    // 开始多点触碰
    if (1 < length && undefined === session.startMultiInput) {
        session.startMultiInput = new InputFactory(pointers);
    }

    if (undefined !== session.prevInput && 1 < session.prevInput.pointers.length && 1 === session.input.pointers.length) {
        session.startInput = new InputFactory(pointers);
    }

    let {
        startInput,
        prevInput,
        input, startMultiInput
    } = session;

    const computed = compute({
        startInput,
        prevInput,
        input, startMultiInput,
    });
    return { ...input, ...computed };
}; 