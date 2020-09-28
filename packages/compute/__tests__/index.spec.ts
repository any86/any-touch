import {getXYAngle} from '../src/ComputeDeltaXY';
test('测试getXYAngle是否正确', () => {
    expect(getXYAngle(0,1)).toBe(0);
    expect(getXYAngle(0,100)).toBe(0);
    expect(getXYAngle(1,1)).toBe(45);
    expect(getXYAngle(Math.sqrt(3),1)).toBe(30);
});