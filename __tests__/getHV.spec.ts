import getHV from '../src/untils/getHV';
test('对垂直或水平的识别是否正确?', () => {
    expect(getHV(['left', 'right'])).toEqual({hasHorizontal: true, hasVertical: false});

    expect(getHV(['up', 'down'])).toEqual({hasHorizontal: false, hasVertical: true});


    expect(getHV(['up', 'left'])).toEqual({hasHorizontal: true, hasVertical: true});

    expect(getHV(['left', 'up'])).toEqual({hasHorizontal: true, hasVertical: true});

    expect(getHV.bind(null, ['a', 'up'])).toThrow('wrong direction!');
});