import createInput from './input/create';
let startInput;
let prevInput;
let activeInput;
let startMutliInput;
export default (event) => {
    const input = createInput(event);
    if (undefined === input)
        return;
    const { nativeEventType } = input;
    if ('start' === nativeEventType) {
        activeInput = input;
        startInput = input;
        if (1 < input.pointerLength) {
            startMutliInput = input;
        }
        else {
            startMutliInput = undefined;
        }
    }
    else if ('move' === nativeEventType) {
        prevInput = activeInput;
        activeInput = input;
    }
    ;
    return {
        startMutliInput,
        startInput,
        prevInput,
        input
    };
};
