# any-touch  [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![npm bundle size (minified + gzip)][size-image]][size-url] [![codecov](https://codecov.io/gh/383514580/any-touch/branch/develop/graph/badge.svg)](https://codecov.io/gh/383514580/any-touch)  [![CircleCI](https://circleci.com/gh/383514580/any-touch.svg?style=svg)](https://circleci.com/gh/383514580/any-touch)

:wave:    一个手势库

[size-image]: https://img.shields.io/bundlephobia/minzip/any-touch.svg
[size-url]: https://bundlephobia.com/result?p=any-touch
[npm-image]: https://img.shields.io/npm/v/any-touch.svg
[npm-url]: https://npmjs.org/package/any-touch

[downloads-image]: https://img.shields.io/npm/dm/any-touch.svg
[downloads-url]: https://npmjs.org/package/any-touch

## 核心功能
- [x] 支持手势: 点击(tap) | 拖拽(pan) | 划过(swipe) | 捏合缩放(pinch) | 旋转(rotate).
- [x] 支持鼠标(mouse)和移动设备(touch)

## 例子
[基础](https://codepen.io/russell2015/pen/rRmQaw#)

[自定义手势-双击](https://codepen.io/russell2015/pen/xBrgjJ)

[全部手势展示](https://383514580.github.io/any-touch/example/)


## 安装
```javascript
npm i -S any-touch
```

## CDN
https://unpkg.com/any-touch

## 开始
```javascript
import AnyTouch from 'any-touch';

// 初始化
const el = doucument.getElementById('gesture-box');
const at = new AnyTouch(el);

// 单击
at.on('tap', ev=>{
  console.log(ev);
});

// 拖拽
at.on('pan', ev=>{
  console.log(ev);
});

// 快速划
at.on('swipe', ev=>{
  console.log(ev);
});

// 缩放
at.on('pinch', ev=>{
  console.log(ev);
});

// 旋转
at.on('rotate', ev=>{
  console.log(ev);
});

```

### 自定义识别器
``` javascript
// 自定义一个双击识别器
const tap2 = new AnyTouch.Tap({
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


