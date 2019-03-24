import computeVector from '../src/compute/computeVector'
test('向量计算函数是否正确?', () => {
    const input = {
        points:[{clientX:1,clientY:1}, {clientX:2,clientY:2}]
    }
    expect(computeVector(input)).toEqual({x:1,y:1});
});