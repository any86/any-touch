export const dataset = {
    "name": "顶级",
    value: 99,
    "children": [{
        "name": "第2级",
        value: 21,
        "children": [{
            "name": "第3级A",
            value: 14,
            "children": [{
                "name": "第4级A",
                "value": 3938
            }, {
                "name": "第4级B",
                "value": 1112
            },]
        },]
    }]
}


// https://blog.csdn.net/qq_34414916/article/details/80026029
// https://www.jianshu.com/p/64305821087a
// https://github.com/d3/d3-shape/blob/master/src/curve/monotone.js

function easeInOut(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
}
function linear(t, b, c, d) {
    return c * t / d + b;
}
const { now } = Date;
export function animate(from = 0, to = 0, duration = 1000, callback = () => void 0) {
    const startTime = window.performance.now();
    function run() {
        const timeDiff = window.performance.now() - startTime;
        const value = easeInOut(timeDiff, from, to - from, duration);
        if (timeDiff <= duration) {
            callback(value);
            requestAnimationFrame(run);
        } else {
            // 修正超出边界
            callback(to, true);
        }
    }
    run();
};



export function canvas(canvas) {
    const pointsGroup = [];
    const context = canvas.getContext('2d');
    context.strokeStyle = '#f60';
    context.moveTo(0, 0);
    context.lineTo(300, 300);
    context.stroke();
}


function drawLine(context) {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(300, 300);
    context.stroke();
    context.closePath();
}