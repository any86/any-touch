let maxLength = 0;
export default ({ pointerLength, isFirst, isFinal }) => {
    if (isFirst) {
        maxLength = pointerLength;
    }
    else {
        maxLength = Math.max(maxLength, pointerLength);
    }
    return maxLength;
};
