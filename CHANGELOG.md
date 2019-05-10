# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.3.0"></a>
# [0.3.0](https://github.com/383514580/a-touch/compare/v0.2.8...v0.3.0) (2019-04-25)


### Bug Fixes

* 修改vue路径大小写错误 ([1876488](https://github.com/383514580/a-touch/commit/1876488))
* 当tap的requireFailure对应的手势为disabled的时候, 不等待直接执行 ([2879771](https://github.com/383514580/a-touch/commit/2879771))
* 把vue指令版本和AnyTouch类分开文件, 防止循环引入 ([f7b3c6c](https://github.com/383514580/a-touch/commit/f7b3c6c))
* 解决ci下缓存不生效bug ([e7e788b](https://github.com/383514580/a-touch/commit/e7e788b))
* 解决ci下缓存不生效bug ([a09ef72](https://github.com/383514580/a-touch/commit/a09ef72))
* 解决ci下缓存不生效bug ([afa80c6](https://github.com/383514580/a-touch/commit/afa80c6))


### Features

*  抽象元素和实例关系管理功能, 防止同一个元素上多次调用同一个指令, 会生成多个anyTouch实例 ([3bb62db](https://github.com/383514580/a-touch/commit/3bb62db))
* 修改v-touch结构, 所有手势均通过v-on绑定, 同时增加单元测试100% ([beb0e24](https://github.com/383514580/a-touch/commit/beb0e24))
* 增加vue指令版 ([1afa8d2](https://github.com/383514580/a-touch/commit/1afa8d2))
* 支持在浏览器引入情况下, 自动挂在指令 ([424544f](https://github.com/383514580/a-touch/commit/424544f))
* 通过指令支持AnyTouch的配置功能 ([e66bde9](https://github.com/383514580/a-touch/commit/e66bde9))


### Performance Improvements

* 通过正则识别手势和手势配置 ([dc0fcbf](https://github.com/383514580/a-touch/commit/dc0fcbf))



<a name="0.2.9"></a>
## [0.2.9](https://github.com/383514580/a-touch/compare/v0.2.8...v0.2.9) (2019-04-06)



<a name="0.2.1"></a>
## [0.2.1](https://github.com/383514580/a-touch/compare/v0.2.0...v0.2.1) (2019-03-20)



<a name="0.2.0"></a>
# [0.2.0](https://github.com/383514580/a-touch/compare/v0.1.1...v0.2.0) (2019-03-19)


### Features

* 增加"移除要求失败判断". removeRequireFailure ([90c01c4](https://github.com/383514580/a-touch/commit/90c01c4))


### Performance Improvements

* 改变test函数内部判断顺序, 把简单的判断放在最前面 ([76633be](https://github.com/383514580/a-touch/commit/76633be))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.1.2](https://github.com/383514580/a-touch/compare/v0.1.1...v0.1.2) (2019-03-13)


### Performance Improvements

* 改变test函数内部判断顺序, 把简单的判断放在最前面 ([76633be](https://github.com/383514580/a-touch/commit/76633be))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.1.1](https://github.com/383514580/a-touch/compare/v0.1.0...v0.1.1) (2019-03-06)
