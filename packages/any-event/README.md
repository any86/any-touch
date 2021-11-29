# any-event [![NPM Version][npm-image]][npm-url] [![npm bundle size (minified + gzip)][size-image]][size-url] [![codecov][codecov-image]][codecov-url] [![CircleCI][ci-image]][ci-url]

[npm-image]: https://img.shields.io/npm/v/any-event.svg
[npm-url]: https://npmjs.org/package/any-event
[downloads-url]: https://npmjs.org/package/any-event
[size-image]: https://img.shields.io/bundlephobia/minzip/any-event.svg
[size-url]: https://bundlephobia.com/result?p=any-event
[codecov-image]: https://codecov.io/gh/any86/any-event/branch/master/graph/badge.svg 
[codecov-url]: https://codecov.io/gh/any86/any-event
[ci-image]: https://circleci.com/gh/any86/any-event.svg?style=svg
[ci-url]: https://circleci.com/gh/any86/any-event

:cake: 不到1k, 一个mini的事件管理器,  希望能在您的代码中做一块砖.


## 安装

``` shell
npm i -S any-event
```

## 使用

``` javascript
import EventEmitter from  'any-event';
const emitter = new EventEmitter();
emitter.on('add', data=>{
    console.log(data) // 1
});
emitter.emit('add', 1);
```
## 方法


### on(eventName, listener)
绑定事件

|名称|类型|数据类型|是否必填|说明|
|---|---|---|---|---|
|eventName| 参数 |`String/Symbol`|是|事件名称|
|listener| 参数 |`Function`|是|对应的回调函数|
|emitter| 返回值 |`EventEmitter`|---|实例|

### off(eventName, listener)
解除绑定, 如果不填写`listener`, 那么`eventName`对应的`listener`都会被移除.

|名称|类型|数据类型|是否必填|说明|
|---|---|---|---|---|
|eventName| 参数 |`String/Symbol`|是|事件名称|
|listener| 参数 |`Function`|是|对应的回调函数|
|emitter| 返回值 |`EventEmitter`|---|实例|

``` javascript
const callback = data=>{
    alert(data)
};
emitter.on('add', callback);
// 解除绑定
emitter.off('add', callback);
// add事件不会触发
emitter.emit('add', 1);
```


### emit(eventName [, ...args])
触发事件, 支持任意数量参数

|名称|类型|数据类型|是否必填|说明|
|---|---|---|---|---|
|eventName| 参数 |`String/Symbol`|是|事件名称|
| args| 参数 |`Any`|是|数据|
|emitter| 返回值 |`Boolean`|---|实例|

``` javascript
const callback = (a,b,c,d)=>{
    console(a,b,c,d); // 1,2,3,4
};
emitter.once('add', callback);
// add事件触发
emitter.emit('add', 1,2,3,4);
```


### destroy()
销毁实例

``` javascript
const callback = (a,b,c,d)=>{
    console(a,b,c,d); // 1,2,3,4
};
emitter.once('add', callback);
emitter.destroy();

// add事件不会触发
emitter.emit('add', 1,2,3,4);
```
