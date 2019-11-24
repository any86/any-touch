import {
    plugins
} from './scripts/rollup.plugins';
import pkg from './package.json';
import path from 'path';
import fs from 'fs';


/**
 * 生成索引文件
 * @param {String} 名称 
 * @param {String} 格式 
 */
function generateIndex(name) {
    const tpl = `if (process.env.NODE_ENV === 'production') {
    module.exports = require('./${name}.common.prod.js');
} else {
    module.exports = require('./${name}.common.dev.js');
}`;

    fs.writeFileSync(`dist/${name}.common.js`, tpl, 'utf8');
}



// vue指令名
const VUE_DIRECTIVE_NAME = 'v-touch';
// 代码头
const banner =
    `/*!
 * AnyTouch.js v${pkg.version}
 * (c) 2018-${new Date().getFullYear()} Russell
 * https://github.com/any86/any-touch
 * Released under the MIT License.
 */`

const IS_PROD = 'production' === process.env.NODE_ENV;
const IS_DEV = 'development' === process.env.NODE_ENV;
const DIST_DIR = 'dist';

if (IS_PROD) {
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR);
    }

    generateIndex(pkg.name);
    generateIndex(VUE_DIRECTIVE_NAME);
}


/**
 * any-touch es && cjs
 */
const AT_ES_CJS_CONFIG = {
    input: './src/main.ts',

    plugins,

    external: ['any-event'],

    output: [{
        format: 'cjs',
        file: `dist/${pkg.name}.common.prod.js`,
        banner,
        sourcemap: IS_DEV,
    }, {
        format: 'es',
        file: `dist/${pkg.name}.esm.js`,
        banner,
        sourcemap: IS_DEV
    }, {
        format: 'cjs',
        file: `dist/${pkg.name}.common.dev.js`,
        banner,
        sourcemap: IS_DEV,
    }]
};

/**
 * any-touch iife
 */
const AT_IIFE_CONFIG = {
    input: './src/main.ts',

    plugins,

    output: [{
        format: 'iife',
        name: 'AnyTouch',
        file: `dist/${pkg.name}.min.js`,
        banner,
        sourcemap: IS_DEV
    }, {
        format: 'iife',
        name: 'AnyTouch',
        file: `dist/${pkg.name}.js`,
        banner,
        sourcemap: IS_DEV
    }]
};


// ========== vTouch ========
/**
 * vTouch es && cjs
 */
const VT_ES_CJS_CONFIG = {
    input: './src/vueDirective/index.ts',

    plugins,

    external: (id) => {
        return '../AnyTouch' === id;
        // return /^babel/.test(id)
    },

    output: [{
            format: 'cjs',
            file: `dist/${VUE_DIRECTIVE_NAME}.common.dev.js`,
            banner,
            sourcemap: IS_DEV,
            paths: (id) => {
                if (path.resolve(__dirname, './src/AnyTouch') === id) {
                    return './any-touch.common'
                }
            }
        }, {
            format: 'cjs',
            file: `dist/${VUE_DIRECTIVE_NAME}.common.prod.js`,
            banner,
            sourcemap: IS_DEV,
            paths: (id) => {
                if (path.resolve(__dirname, './src/AnyTouch') === id) {
                    return './any-touch.common'
                }
            }
        },
        {
            format: 'es',
            file: `dist/${VUE_DIRECTIVE_NAME}.esm.js`,
            banner,
            sourcemap: IS_DEV,
            paths: (id) => {
                if (path.resolve(__dirname, './src/AnyTouch') === id) {
                    return './any-touch.esm'
                }
            }
        }
    ]
}
/**
 * vTouch iife
 */
const VT_IIFE_CONFIG = {
    input: './src/vueDirective/index.ts',

    plugins,

    external: (id) => {
        return '../AnyTouch' === id;
    },

    output: [{
        format: 'iife',
        name: 'vTouch',
        file: `dist/${pkg.name}.${VUE_DIRECTIVE_NAME}.min.js`,
        banner,
        sourcemap: IS_DEV,
        globals: {
            [path.resolve(__dirname, './src/AnyTouch')]: 'AnyTouch'
        },
    }, {
        format: 'iife',
        name: `vTouch`,
        file: `dist/${pkg.name}.${VUE_DIRECTIVE_NAME}.js`,
        banner,
        sourcemap: IS_DEV,
        globals: {
            [path.resolve(__dirname, './src/AnyTouch')]: 'AnyTouch'
        },
    }]
}
// export default IS_PROD ? [AT_ES_CJS_CONFIG, AT_IIFE_CONFIG, VT_ES_CJS_CONFIG, VT_IIFE_CONFIG] : [AT_IIFE_CONFIG, VT_IIFE_CONFIG];

export default IS_PROD ? [AT_ES_CJS_CONFIG, AT_IIFE_CONFIG] : [AT_IIFE_CONFIG];
