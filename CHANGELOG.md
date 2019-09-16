# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.4.7"></a>
## [0.4.7](https://github.com/any86/any-touch/compare/v0.4.5...v0.4.7) (2019-09-16)


### Bug Fixes

* 修复MaxLength计算错误 ([de7cf91](https://github.com/any86/any-touch/commit/de7cf91))
* 修复press触点限制 ([6739b76](https://github.com/any86/any-touch/commit/6739b76))



<a name="0.4.6"></a>
## [0.4.6](https://github.com/any86/any-touch/compare/v0.4.5...v0.4.6) (2019-09-16)


### Bug Fixes

* 修复press触点限制 ([6739b76](https://github.com/any86/any-touch/commit/6739b76))



<a name="0.4.5"></a>
## [0.4.5](https://github.com/any86/any-touch/compare/v0.4.4...v0.4.5) (2019-09-11)



<a name="0.4.4"></a>
## [0.4.4](https://github.com/any86/any-touch/compare/v0.4.3...v0.4.4) (2019-08-23)



<a name="0.4.3"></a>
## [0.4.3](https://github.com/any86/any-touch/compare/v0.4.1...v0.4.3) (2019-08-23)



<a name="0.4.2"></a>
## [0.4.2](https://github.com/any86/any-touch/compare/v0.4.1...v0.4.2) (2019-08-21)



<a name="0.4.1"></a>
## [0.4.1](https://github.com/any86/any-touch/compare/v0.4.0...v0.4.1) (2019-08-20)


### Bug Fixes

* 取消小程序不支持对象, 比如window ([480316c](https://github.com/any86/any-touch/commit/480316c))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/any86/any-touch/compare/v0.3.5...v0.4.0) (2019-08-19)


### Features

* 支持微信小程序 ([a894aed](https://github.com/any86/any-touch/commit/a894aed))



<a name="0.3.5"></a>
## [0.3.5](https://github.com/any86/any-touch/compare/v0.3.4...v0.3.5) (2019-07-26)


### Bug Fixes

* 修复SupportEvent报错 ([155c3ea](https://github.com/any86/any-touch/commit/155c3ea))
* 修改大小写拼写错误 ([015c1d3](https://github.com/any86/any-touch/commit/015c1d3))
* 修改路径 ([2ae77a0](https://github.com/any86/any-touch/commit/2ae77a0))
* 取消Point的readonly ([f4fc469](https://github.com/any86/any-touch/commit/f4fc469))



<a name="0.3.4"></a>
## [0.3.4](https://github.com/any86/any-touch/compare/v0.3.3...v0.3.4) (2019-07-08)


### Bug Fixes

* 修改demo中的冗余项目 ([bb5e7bf](https://github.com/any86/any-touch/commit/bb5e7bf))
* 修改错误的接口 ([da9bb96](https://github.com/any86/any-touch/commit/da9bb96))
* 修正文件名大小写 ([c150dd7](https://github.com/any86/any-touch/commit/c150dd7))
* 删除错误的类型标注 ([dfee7b9](https://github.com/any86/any-touch/commit/dfee7b9))
* 识别器增加"正在等待"状态, 这样可以保证有识别器数组中的识别器的执行顺序不会被requireFailure的执行顺序颠倒 ([51efe81](https://github.com/any86/any-touch/commit/51efe81))
* 通过取余判断tap的次数 ([6b2b0df](https://github.com/any86/any-touch/commit/6b2b0df))



<a name="0.3.3"></a>
## [0.3.3](https://github.com/any86/any-touch/compare/v0.3.2...v0.3.3) (2019-05-13)


### Bug Fixes

* 修复间隔计算数据过程中， 排除INPUT_END阶段的数据刷新 ([3baa6b8](https://github.com/any86/any-touch/commit/3baa6b8))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/any86/any-touch/compare/v0.3.1...v0.3.2) (2019-05-10)


### Bug Fixes

* 修改pkg中错误的主页地址 ([7c0fb9d](https://github.com/any86/any-touch/commit/7c0fb9d))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/any86/any-touch/compare/v0.3.0...v0.3.1) (2019-05-10)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/any86/any-touch/compare/v0.2.8...v0.3.0) (2019-04-25)


### Bug Fixes

* 修改vue路径大小写错误 ([1876488](https://github.com/any86/any-touch/commit/1876488))
* 当tap的requireFailure对应的手势为disabled的时候, 不等待直接执行 ([2879771](https://github.com/any86/any-touch/commit/2879771))
* 把vue指令版本和AnyTouch类分开文件, 防止循环引入 ([f7b3c6c](https://github.com/any86/any-touch/commit/f7b3c6c))
* 解决ci下缓存不生效bug ([e7e788b](https://github.com/any86/any-touch/commit/e7e788b))
* 解决ci下缓存不生效bug ([a09ef72](https://github.com/any86/any-touch/commit/a09ef72))
* 解决ci下缓存不生效bug ([afa80c6](https://github.com/any86/any-touch/commit/afa80c6))


### Features

*  抽象元素和实例关系管理功能, 防止同一个元素上多次调用同一个指令, 会生成多个anyTouch实例 ([3bb62db](https://github.com/any86/any-touch/commit/3bb62db))
* 修改v-touch结构, 所有手势均通过v-on绑定, 同时增加单元测试100% ([beb0e24](https://github.com/any86/any-touch/commit/beb0e24))
* 增加vue指令版 ([1afa8d2](https://github.com/any86/any-touch/commit/1afa8d2))
* 支持在浏览器引入情况下, 自动挂在指令 ([424544f](https://github.com/any86/any-touch/commit/424544f))
* 通过指令支持AnyTouch的配置功能 ([e66bde9](https://github.com/any86/any-touch/commit/e66bde9))


### Performance Improvements

* 通过正则识别手势和手势配置 ([dc0fcbf](https://github.com/any86/any-touch/commit/dc0fcbf))



<a name="0.2.9"></a>
## [0.2.9](https://github.com/any86/any-touch/compare/v0.2.8...v0.2.9) (2019-04-06)



<a name="0.2.1"></a>
## [0.2.1](https://github.com/any86/any-touch/compare/v0.2.0...v0.2.1) (2019-03-20)



<a name="0.2.0"></a>
# [0.2.0](https://github.com/any86/any-touch/compare/v0.1.1...v0.2.0) (2019-03-19)


### Features

* 增加"移除要求失败判断". removeRequireFailure ([90c01c4](https://github.com/any86/any-touch/commit/90c01c4))


### Performance Improvements

* 改变test函数内部判断顺序, 把简单的判断放在最前面 ([76633be](https://github.com/any86/any-touch/commit/76633be))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.1.2](https://github.com/any86/any-touch/compare/v0.1.1...v0.1.2) (2019-03-13)


### Performance Improvements

* 改变test函数内部判断顺序, 把简单的判断放在最前面 ([76633be](https://github.com/any86/any-touch/commit/76633be))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.1.1](https://github.com/any86/any-touch/compare/v0.1.0...v0.1.1) (2019-03-06)
