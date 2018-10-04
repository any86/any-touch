export default function ({
    prevInput,
    input
}: any): { deltaX: number, deltaY: number } {
    let deltaX: number;
    let deltaY: number;
    if (undefined === prevInput) {
        deltaX = 0;
        deltaY = 0;
    } else if ('end' === input.status) {
        deltaX = 0;
        deltaY = 0;
    } else {
        deltaX = input.centerX - prevInput.centerX;
        deltaY = input.centerY - prevInput.centerY;
    }
    return { deltaX, deltaY };
};