# 用TypeScript开发手势库 - (2)tsconfig.json & rollup.config.js & npx

![https://github.com/383514580/any-touch](https://ww1.sinaimg.cn/large/005IQkzXly1g1as0lsa1hj30m805ugmp.jpg)

 [any-touch](https://github.com/383514580/any-touch) 一个手势库

## 往期目录
[用 TypeScript 开发手势库 - (1)web开发常用手势有哪些?](https://juejin.im/post/5c8fc2105188252d72550acf)


## 标题有点长
今天的标题有点长, 但不难, 讲的都是工具配置和使用, 就3个知识点:
1. 如何配置tsconfig.json
2. 如何配置rollup.config.js
3. 使用npx运行项目所在node_modules的命令

## rollup.config.js

**注**: 为了阅读体验, 我把**为什么不用webpack**放在的本文的最后. 我对代码做了注释(如有不懂请留言):
```javascript
// 为了让rollup识别commonjs类型的包,默认只支持导入ES6
import commonjs from 'rollup-plugin-commonjs';
// 为了支持import xx from 'xxx'
import nodeResolve from 'rollup-plugin-node-resolve';
// ts转js的编译器
import typescript from 'rollup-plugin-typescript';
// 支持加载json文件
import json from 'rollup-plugin-json';
// 支持字符串替换, 比如动态读取package.json的version到代码
import replace from 'rollup-plugin-replace';
// 读取package.json
import pkg from './package.json';
// 代码生成sourcemaps
import sourceMaps from 'rollup-plugin-sourcemaps'

// 代码头
const banner =
    `/*!
 * AnyTouch.js v${pkg.version}
 * (c) 2018-${new Date().getFullYear()} Russell
 * https://github.com/383514580/any-touch
 * Released under the MIT License.
 */`

export default {
    input: './src/main.ts',
    plugins: [
        // 代码中的__VERSION__字符串会被package.json中的version字段所替代
        replace({
            __VERSION__: pkg.version
        }),

        typescript({
            exclude: 'node_modules/**',
            typescript: require('typescript'),

        }),
        json(),
        nodeResolve({
            jsnext: true,
            main: true
        }),

        commonjs({
            include: 'node_modules/**'
        }),

        sourceMaps()

    ],
    output: [{
            format: 'cjs',
            // 生成的文件名和路径
            // package.json的main字段, 也就是模块的入口文件
            file: pkg.main, 
            banner,
            sourcemap: true
        },
        {
            format: 'es',
            // rollup和webpack识别的入口文件, 如果没有该字段, 那么会去读取main字段
            file: pkg.module,
            banner,
            sourcemap: true
        },
        {
            format: 'umd',
            name: 'AnyTouch',
            file: pkg.browser,
            banner,
            sourcemap: true
        }
    ]
};
```
[源码](https://github.com/383514580/any-touch/blob/master/rollup.config.js)

## tsconfig.js

``` Javascript
{
    "compilerOptions": {
        // 允许未执行的代码不报错
        "allowUnreachableCode": true,
        // 严格模式, 强烈建议开启
        "strict": true,
        // 支持别名导入:
        // import * as React from "react"
        "esModuleInterop": true,
        // 目标js的版本
        "target": "es5",
        // 目标代码的模块结构版本
        "module": "es6",
        // 在表达式和声明上有隐含的 any类型时报错。
        "noImplicitAny": true,
        // 删除注释
        "removeComments": true,
        // 保留 const和 enum声明
        "preserveConstEnums": false,
        // 生成sourceMap    
        "sourceMap": true,
        // 目标文件所在路径
        "outDir": "./lib",
        // 编译过程中需要引入的库文件的列表
        "lib": [
            "dom",
            "es7"
        ],
        // 额外支持解构/forof等功能
        "downlevelIteration": true,
        // 是否生成声明文件
        "declaration": true,
        // 声明文件路径
        "declarationDir": "./lib",
        // 此处设置为node,才能解析import xx from 'xx'
        "moduleResolution": "node"
    },
    // 入口文件
    "include": [
        "src/main.ts"
    ]
}
```
[源码](https://github.com/383514580/any-touch/blob/master/tsconfig.json)

## 运行命令
好了文件配置好了, 我们可以把我们的ts代码转成js, 就差在package.json中加一条命令了: 
```javscript
// package.json
{
    ...
    "script": {
        "build": "tsc && rollup -c"
    }
    ...
}
```
这里`tsc`是为了在lib目录生产**声明文件**, `rollup -c`会生成umd/es/commonjs三种模块的代码, "c"是config缩写, 代表读取rollup.config.js

[源码](https://github.com/383514580/any-touch/blob/master/package.json)

## 彩蛋
其实**npx**并不是本文主角,但是**如果**你的tsc不是全局安装的, 那么你在命令行运行tsc会提示找不到他, 但是如果你用`npx tsc`那么他就会**运行你本地的node_modules中的tsc命令**, 惊不惊喜.

## 补充说明
如果你了解webpack和rollup的不同下面内容可以跳过.

### 为什么不用webpack
一说到打包工具大家想到的肯定是webpack, 他有各种loader, 当然也有ts-loader, 但是他生成代码有很多是非我们所写的逻辑代码, 比如一些他自有的模块加载功能:

![webpack](https://ww1.sinaimg.cn/large/005IQkzXly1g1apvg17axj30pu0fpab4.jpg)

### rollup更适合开发插件?
是的, rollup生成代码只是把我们的代码转码成目标js并无其他, 同使如果需要,他可以同时帮我们生成支持umd/commonjs/es的js代码, **vue** / **react** /**angular**都在用他作为打包工具.

**vue**
![vue](https://ww1.sinaimg.cn/large/005IQkzXly1g1aq723deej30iu05vgm4.jpg)
**react**
![react](https://ww1.sinaimg.cn/large/005IQkzXly1g1aq6udkhfj30fr02ijrd.jpg)
**angular**
![angular](https://ww1.sinaimg.cn/large/005IQkzXly1g1aq6g16hkj30dk048q2y.jpg)

## 为什么还没到写代码?
2期了都还没有讲到代码, 估计大家都着急, 莫着急,下一期开始咱们就讲代码了, 平时上班工作实在是忙, 都是晚上更新文章, 这个周末我会多写点, 如果实在迫不及待也可以先看看我写好的代码预热下: 

[https://github.com/383514580/any-touch](https://github.com/383514580/any-touch)