export default function ({
    prevInput,
    input
}: any): { deltaX: number, deltaY: number } {
    let deltaX: number;
    let deltaY: number;
    if ('end' === input.nativeEventType || 'start' === input.nativeEventType) {
        deltaX = 0;
        deltaY = 0;
    } else {
        deltaX = input.centerX - prevInput.centerX;
        deltaY = input.centerY - prevInput.centerY;
    }

    return { deltaX, deltaY };
};