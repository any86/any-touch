import { Vector } from './interface';
import { propX, propY } from './const';
const { round } = Math;
/**
 * 获取向量长度(向量模)
 * @param {Object} 向 量
 */
export const getVLength = (v: Vector): number => {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

/**
 * 点积
 * @param {Object} v1
 * @param {Object} v2
 */
export const getDotProduct = (v1: Vector, v2: Vector) => {
    return v1.x * v2.x + v1.y * v2.y;
}

/**
 * 向量夹角(弧度)
 * @param {Object} v1
 * @param {Object} v2
 */
export const getRadian = (v1: Vector, v2: Vector) => {
    var mr = getVLength(v1) * getVLength(v2);
    if (mr === 0) return 0;
    var r = getDotProduct(v1, v2) / mr;
    if (r > 1) r = 1;
    return Math.acos(r);
}

/**
 * 求旋转方向
 * 顺时针/逆时针
 */
export const getCross = (v1: Vector, v2: Vector) => {
    return v1.x * v2.y - v2.x * v1.y;
}

/**
 * 向量夹角(角度)
 * @param {Object} v1
 * @param {Object} v2
 */
export const getAngle = (v1: Vector, v2: Vector) => {
    var angle = getRadian(v1, v2);
    if (getCross(v1, v2) > 0) {
        angle *= -1;
    }
    return radianToAngle(angle);
};

/**
 * 弧度转角度
 * @param {Number} 弧度 
 */
export const radianToAngle = (radian: number): number => radian / Math.PI * 180;

/**
 * 角度转弧度
 * @param {Number} 角度 
 */
export const angleToRadian = (angle: number): number => angle / 180 * Math.PI;

/**
 * 获取多点之间的中心坐标
 * @param {Array} 触碰点 
 */
export const getCenter = (points: any) => {
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
    } else {
        return { x: round(points[0][propX]), y: round(points[0][propY]) };
    }
};

/**
 * 
 * @param {Number} 事件开始到结束的X位移 
 * @param {Number} 事件开始到结束的Y位移 
 */
export const getDirection = (displacementX: number, displacementY: number): string => {
    if (displacementX === displacementY) {
        return 'none';
    } else if (Math.abs(displacementX) > Math.abs(displacementY)) {
        return 0 < displacementX ? 'right' : 'left';
    } else {
        return 0 < displacementY ? 'down' : 'up';
    }
};
