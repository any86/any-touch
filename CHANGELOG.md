# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.1.0"></a>
# [0.1.0](https://github.com/383514580/a-touch/compare/v0.0.23...v0.1.0) (2019-03-06)


### Bug Fixes

* 修复对end阶段缺少scale/angle的默认值 ([f831d7b](https://github.com/383514580/a-touch/commit/f831d7b))
* 修复对end阶段缺少scale/angle的默认值 ([4214487](https://github.com/383514580/a-touch/commit/4214487))
* 删除错误的代码: const pkg = require('../package.json'); ([6e6c9b1](https://github.com/383514580/a-touch/commit/6e6c9b1))
* 取消end阶段触发pinchin/pinchout ([62216aa](https://github.com/383514580/a-touch/commit/62216aa))
* 手势实例的set方法执行后返回实例 ([6ae3862](https://github.com/383514580/a-touch/commit/6ae3862))


### Features

* 增加inputstart/inputend/inputcancel/inputreduce/inputadd/inputmove事件 ([17a121d](https://github.com/383514580/a-touch/commit/17a121d))
* 增加input事件 ([76b9ce5](https://github.com/383514580/a-touch/commit/76b9ce5))
* 实例上增加stop功能, 运行后, 立即停止后面的手势识别直到下一轮识别 ([0a6d858](https://github.com/383514580/a-touch/commit/0a6d858))
* 限制鼠标只有左键才能出发事件 ([9818141](https://github.com/383514580/a-touch/commit/9818141))
* 限制鼠标只有左键才能出发事件 ([7426458](https://github.com/383514580/a-touch/commit/7426458))



<a name="0.0.27"></a>
## 0.0.27 (2019-02-11)


### Bug Fixes

* eventBus在不方法识别器原型上, 因为这样会造成多个AnyTouch实例公用一个eventBus, 改放在识别器实例上 ([1d0a8b4](https://github.com/383514580/a-touch/commit/1d0a8b4))
* 修复Tap识别器对每次点击距离之间的限制 ([992d955](https://github.com/383514580/a-touch/commit/992d955))
* 方向增加‘none', 用来表示x和y移动距离相同时的方向， 这样就可以区分出有没有移动 ([a033da7](https://github.com/383514580/a-touch/commit/a033da7))


### Features

* 用rollup-plugin-json / 用rollup-plugin-replace实现代码内读取package.json中的version字段 ([f57e817](https://github.com/383514580/a-touch/commit/f57e817))



<a name="0.1.0"></a>
# [0.1.0](https://github.com/383514580/a-touch/compare/v0.0.23...v0.1.0) (2019-03-05)


### Bug Fixes

* 修复对end阶段缺少scale/angle的默认值 ([f831d7b](https://github.com/383514580/a-touch/commit/f831d7b))
* 修复对end阶段缺少scale/angle的默认值 ([4214487](https://github.com/383514580/a-touch/commit/4214487))
* 删除错误的代码: const pkg = require('../package.json'); ([6e6c9b1](https://github.com/383514580/a-touch/commit/6e6c9b1))
* 取消end阶段触发pinchin/pinchout ([62216aa](https://github.com/383514580/a-touch/commit/62216aa))
* 手势实例的set方法执行后返回实例 ([6ae3862](https://github.com/383514580/a-touch/commit/6ae3862))


### Features

* 增加inputstart/inputend/inputcancel/inputreduce/inputadd/inputmove事件 ([17a121d](https://github.com/383514580/a-touch/commit/17a121d))
* 增加input事件 ([76b9ce5](https://github.com/383514580/a-touch/commit/76b9ce5))
* 实例上增加stop功能, 运行后, 立即停止后面的手势识别直到下一轮识别 ([0a6d858](https://github.com/383514580/a-touch/commit/0a6d858))
* 限制鼠标只有左键才能出发事件 ([9818141](https://github.com/383514580/a-touch/commit/9818141))
* 限制鼠标只有左键才能出发事件 ([7426458](https://github.com/383514580/a-touch/commit/7426458))



<a name="0.0.27"></a>
## 0.0.27 (2019-02-11)


### Bug Fixes

* eventBus在不方法识别器原型上, 因为这样会造成多个AnyTouch实例公用一个eventBus, 改放在识别器实例上 ([1d0a8b4](https://github.com/383514580/a-touch/commit/1d0a8b4))
* 修复Tap识别器对每次点击距离之间的限制 ([992d955](https://github.com/383514580/a-touch/commit/992d955))
* 方向增加‘none', 用来表示x和y移动距离相同时的方向， 这样就可以区分出有没有移动 ([a033da7](https://github.com/383514580/a-touch/commit/a033da7))


### Features

* 用rollup-plugin-json / 用rollup-plugin-replace实现代码内读取package.json中的version字段 ([f57e817](https://github.com/383514580/a-touch/commit/f57e817))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.0.24](https://github.com/383514580/a-touch/compare/v0.0.23...v0.0.24) (2019-01-20)



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.0.23 (2019-01-20)


### Bug Fixes

* package.json增加types字段 ([fb352eb](https://github.com/383514580/a-touch/commit/fb352eb))
* 修复"即时方向"错误 ([b41797d](https://github.com/383514580/a-touch/commit/b41797d))
* 修复"即时方向"错误 ([ea51838](https://github.com/383514580/a-touch/commit/ea51838))
* 修复bundlephobia计算不到尺寸的问题 ([e88c404](https://github.com/383514580/a-touch/commit/e88c404))
* 修复off方法错误 ([4c358b1](https://github.com/383514580/a-touch/commit/4c358b1))
* 修复pan对directions的限制失效问题 ([bad1caa](https://github.com/383514580/a-touch/commit/bad1caa))
* 修复press会触发多次的错误 ([b3640af](https://github.com/383514580/a-touch/commit/b3640af))
* 修复swipe不触发 ([a0c171a](https://github.com/383514580/a-touch/commit/a0c171a))
* 对add方法内部增加update, 以便相应识别新加识别器上touchaction的变化 ([2ae1ca9](https://github.com/383514580/a-touch/commit/2ae1ca9))
* 解决rollup不解析commonjs格式的包 ([18cb8aa](https://github.com/383514580/a-touch/commit/18cb8aa))
* 识别器用set方法不再触发anyTouch的绑定事件, 发布0.0.12 ([922ad87](https://github.com/383514580/a-touch/commit/922ad87))



####[v0.0.2]
- 支持destory
- 内部抽象出更细的computed函数

####[v0.0.1]
- 简单实现各个手势