const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ts = require('typescript');
// ======== 生成声明文件到types目录 ========
console.log(chalk.blue('🚀 正在生成tds!'))
const tsFiles = [];
const PACKAGES_DIR = 'packages';
walkDir(PACKAGES_DIR, path => {
    // if (/^packages(\/)[\w-]+\1src\1([\w/]|[^test])+\.ts$/.test(path)) {
    //     tsFiles.push(path);
    // }
    if (/^packages(\/)[\w-]+\1src\1index\.ts$/.test(path)) {
        tsFiles.push(path);
    }
});

compile(tsFiles);
// ======== 生成声明文件到types目录 ========


// 遇到文件执行回调
function walkDir(distDir, callback, deep = 2, activeDeep = 0) {
    const fileOrDirs = fs.readdirSync(distDir);
    for (const fileOrDir of fileOrDirs) {
        const path = `${distDir}/${fileOrDir}`;
        const stats = fs.statSync(path);
        // 文件夹
        if (stats.isDirectory() && activeDeep < deep) {
            walkDir(path, callback, deep, activeDeep + 1);
        } else {
            callback(path);
        }
    }
}

// 编译dts
function compile(fileNames) {
    const options = {
        declaration: true,
        emitDeclarationOnly: true,
    };
    const host = ts.createCompilerHost(options);
    host.writeFile = (fileName, contents) => {
        const typeFileName = path.basename(fileName);
        const typeDir = path.resolve(fileName, '../../', 'dist');
        const filePath = path.join(typeDir, typeFileName);
        if (!fs.existsSync(typeDir)) {
            fs.mkdirSync(typeDir, {
                recursive: true
            });
        }
        fs.writeFileSync(filePath, contents);
        console.log(chalk.green(filePath));
    }
    const program = ts.createProgram(fileNames, options, host);
    program.emit();
}