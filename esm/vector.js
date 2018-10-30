import { propX, propY } from './const';
const { round } = Math;
const getVLength = (v) => {
    return Math.sqrt(v.x * v.x + v.y * v.y);
};
const getDotProduct = (v1, v2) => {
    return v1.x * v2.x + v1.y * v2.y;
};
const getRadian = (v1, v2) => {
    var mr = getVLength(v1) * getVLength(v2);
    if (mr === 0)
        return 0;
    var r = getDotProduct(v1, v2) / mr;
    if (r > 1)
        r = 1;
    return Math.acos(r);
};
const getCross = (v1, v2) => {
    return v1.x * v2.y - v2.x * v1.y;
};
const getAngle = (v1, v2) => {
    var angle = getRadian(v1, v2);
    if (getCross(v1, v2) > 0) {
        angle *= -1;
    }
    return angle * 180 / Math.PI;
};
const getCenter = (points) => {
    const pointLength = points.length;
    if (1 < pointLength) {
        let x = 0;
        let y = 0;
        let i = 0;
        while (i < pointLength) {
            x += points[i][propX];
            y += points[i][propY];
            i++;
        }
        return {
            x: round(x / pointLength),
            y: round(y / pointLength)
        };
    }
    else {
        return { x: round(points[0][propX]), y: round(points[0][propY]) };
    }
};
const getDirection = (displacementX, displacementY) => {
    if (displacementX === displacementY) {
        return 'none';
    }
    else if (Math.abs(displacementX) > Math.abs(displacementY)) {
        return 0 < displacementX ? 'right' : 'left';
    }
    else {
        return 0 < displacementY ? 'down' : 'up';
    }
};
export { getDirection, getVLength, getDotProduct, getRadian, getCross, getAngle, getCenter };
