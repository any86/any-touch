# any-touch  [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] 
<a href="https://circleci.com/gh/383514580/any-touch"><img src="https://img.shields.io/circleci/project/github/383514580/any-touch/dev.svg" alt="Build Status"></a>
:wave:    一个手势库


[npm-image]: https://img.shields.io/npm/v/any-touch.svg
[npm-url]: https://npmjs.org/package/any-touch

[downloads-image]: https://img.shields.io/npm/dm/any-touch.svg
[downloads-url]: https://npmjs.org/package/any-touch

## 安装

```javascript
npm i -S any-touch
```

## 使用

```javascript
import AnyTouch from 'any-touch';

// 初始化
const el = doucument.getElementById('gesture-box');
const at = new AnyTouch(el);

// 绑定手势
at.on('pan', anyTouchEvent=>{
  console.log(anyTouchEvent.deltaX);
})

// 销毁
at.destory();
```

## 已完成

- [x] 支持手势: tap | doubletap | pan | swipe | pinch | rotate.
- [x] 支持鼠标(mouse)
- [x] 手势互斥(requireFailure)

## 计划加入功能

- [ ] 识别input数据变形(transform)
- [ ] 自定义识别器(recgnizer)
- [ ] 停止继续识别(stop)
- [ ] 自定义任意触点,让鼠标支持rotate和pinch(addPointer)

## 单元测试(test)

- [x] tap
- [x] pan
- [ ] swipe
- [ ] rotate
- [ ] pinch

