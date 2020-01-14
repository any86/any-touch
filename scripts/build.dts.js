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
        // console.log("### JavaScript\n")
        // console.log(host.readFile(file))

        // console.log("### Type Definition\n")
        // console.log({file})

        const dts = file.replace(".ts", ".d.ts");
        const dist = dts.replace('/src', '/types');
        const distDir = path.dirname(dist);
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir);
        }

        fs.writeFileSync(dist, createdFiles[dts]);

    })
}



const tsFiles = [];
const PACKAGES_DIR = 'packages';
const dirs = fs.readdirSync(PACKAGES_DIR);
for (const dir of dirs) {
    const stats = fs.statSync(`${PACKAGES_DIR}/${dir}`);
    if (stats.isDirectory()) {
        if ('types' !== dir) {
            const files = fs.readdirSync(`${PACKAGES_DIR}/${dir}/src`);
            for (const file of files) {
                const filePath = `${PACKAGES_DIR}/${dir}/src/${file}`;
                const stats = fs.statSync(filePath);
                if (stats.isFile()) {
                    tsFiles.push(filePath)
                }
            }

        }
    }
}

// Run the compiler
compile(tsFiles, {
    declaration: true,
    emitDeclarationOnly: true,
});