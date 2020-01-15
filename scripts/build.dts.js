const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ts = require('typescript');


function compile(fileNames, options) {
    // Create a Program with an in-memory emit
    const createdFiles = {}
    const host = ts.createCompilerHost(options);
    host.writeFile = (fileName, contents) => createdFiles[fileName] = contents

    // Prepare and emit the d.ts files
    const program = ts.createProgram(fileNames, options, host);
    program.emit();
    // Loop through all the input files
    fileNames.forEach(file => {
        const dts = file.replace(".ts", ".d.ts");
        const dist = dts.replace('/src', '/types');
        const distDir = path.dirname(dist);
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
        }

        fs.writeFileSync(dist, createdFiles[dts]);

    })
}


const tsFiles = [];
const PACKAGES_DIR = 'packages';
walkDir(PACKAGES_DIR, path => {
    if (/^packages(\/)[\w-]+\1src\1([\w/]|[^test])+\.ts$/.test(path)) {
        tsFiles.push(path);
        console.log({path})
    }
});

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

// Run the compiler
compile(tsFiles, {
    declaration: true,
    emitDeclarationOnly: true,
});