# any-touch [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![size-image]][size-url] [![codecov](https://codecov.io/gh/any86/any-touch/branch/master/graph/badge.svg)](https://codecov.io/gh/any86/any-touch) [![CircleCI](https://circleci.com/gh/any86/any-touch.svg?style=svg)](https://circleci.com/gh/any86/any-touch)

[size-image]: https://badgen.net/bundlephobia/minzip/@any-touch/core
[size-url]: https://bundlephobia.com/result?p=@any-touch/core
[npm-image]: https://badgen.net/npm/v/any-touch
[npm-url]: https://npmjs.org/package/any-touch
[downloads-image]: https://badgen.net/npm/dt/any-touch
[downloads-url]: https://npmjs.org/package/any-touch

![6类手势](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/102a244991064824900ac45efeb9251d~tplv-k3u1fbpfcp-zoom-1.image)


-   支持 PC 端 / 移动端 / 微信小程序.
-   默认加载**6 个手势**, 也可按需加载手势, 核心**1kb**, 完整**4kb**.
-   **无依赖, 不限于 Vue / React / Angular等...**

## 演示

<details>
<summary>查看二维码</summary>
<img src="https://user-images.githubusercontent.com/8264787/104836031-a55ca780-58e5-11eb-936a-7e2d1a05ee86.png" />
</details>

[直接访问](https://any86.github.io/any-touch)


## 安装

```javascript
npm i -S any-touch
```

## CDN

```html
<script src="https://unpkg.com/any-touch/dist/any-touch.umd.min.js"></script>
<script>
    console.log(AnyTouch.version); // 2.x.x
</script>
```

## 快速开始

```javascript
import AnyTouch from 'any-touch';

const el = document.getElementById('box');
const at = new AnyTouch(el);

// e包含位移/速度/方向等信息
at.on('pan', (e) => console.log(e));
```

[🚀 更多文档](https://github.com/any86/any-touch#any-touch-----)