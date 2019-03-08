# any-touch  [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![npm bundle size (minified + gzip)][size-image]][size-url] [![codecov](https://codecov.io/gh/383514580/any-touch/branch/develop/graph/badge.svg)](https://codecov.io/gh/383514580/any-touch)  [![CircleCI](https://circleci.com/gh/383514580/any-touch.svg?style=svg)](https://circleci.com/gh/383514580/any-touch)

:wave:    一个手势库

[size-image]: https://img.shields.io/bundlephobia/minzip/any-touch.svg
[size-url]: https://bundlephobia.com/result?p=any-touch
[npm-image]: https://img.shields.io/npm/v/any-touch.svg
[npm-url]: https://npmjs.org/package/any-touch

[downloads-image]: https://img.shields.io/npm/dm/any-touch.svg
[downloads-url]: https://npmjs.org/package/any-touch

## 核心功能
- [x] 支持手势: 点击(tap) | 拖拽(pan) | 快速划(swipe) | 捏合缩放(pinch) | 旋转(rotate).
- [x] 支持鼠标(mouse)和移动设备(touch)

## 演示
[查看](https://383514580.github.io/any-touch/example/)

## 安装

```javascript
npm i -S any-touch
```

## 使用

### 基础[预览](https://codepen.io/russell2015/pen/rRmQaw#)
```javascript
import AnyTouch from 'any-touch';

// 初始化
const el = doucument.getElementById('gesture-box');
const at = new AnyTouch(el);

// 绑定手势
at.on('pan', ev=>{
  console.log(ev.deltaX);
})

// 解除绑定
at.off('pan')

// 销毁
at.destory();
```

### 自定义识别器
``` javascript
// 自定义一个双击识别器
const tap2 = new AnyTouch.TapRecognizer({
    name: 'doubletap',
    pointer: 1,
    taps: 2
});

// 添加自定义手势 
const el = doucument.getElementById('gesture-box');
const at = new AnyTouch(el);
at.add(tap2);
at.on('tap2', ev=>{
  console.log(ev);
});

// 一般情况下不期望双击时触发单击, 
// 所以要声明单击的触发一定要等待(一段时间内)双击没有触发(失败)才可以
const tap1 = anyTouch.get('tap');
tap1.requireFailure(tap2);
```

## API
### stop
阻止后续的识别器(tap/pan/rotate等)进行识别.
```javascript

// 通过recognizers属性, 我们可以知道识别器的顺序.
// 默认pinch在rotate后面
console.log(at.recognizers);
at.on('rotate', ()=>{
  // 后面的识别器就不会运行了.
  // 注意stop方法在实例上.
  at.stop();
});
```


