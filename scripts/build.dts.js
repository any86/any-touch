const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ts = require('typescript');
const ora = require('ora');

// ======== 生成声明文件到types目录 ========
const tsFiles = [];
const PACKAGES_DIR = 'packages';
walkDir(PACKAGES_DIR, path => {
    if (/^packages(\/)[\w-]+\1src\1([\w/]|[^test])+\.ts$/.test(path)) {
        tsFiles.push(path);
    }
});
compile(tsFiles);
// ======== 生成声明文件到types目录 ========


// 遇到文件执行回调
function walkDir(distDir, callback) {
    const fileOrDirs = fs.readdirSync(distDir);
    for (const fileOrDir of fileOrDirs) {
        const path = `${distDir}/${fileOrDir}`;
        const stats = fs.statSync(path);
        // 文件夹
        if (stats.isDirectory()) {
            walkDir(path, callback);
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
        const typeDir = path.resolve(fileName, '../../','types');
        const filePath = path.join(typeDir,typeFileName);
        if (!fs.existsSync(typeDir)) {
            fs.mkdirSync(typeDir, { recursive: true });
        }
        fs.writeFileSync(filePath, contents);
    }
    const program = ts.createProgram(fileNames, options, host);
    program.emit();
}