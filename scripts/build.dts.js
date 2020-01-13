const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ts = require('typescript');


function compile(fileNames, options){
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

        const dts = file.replace(".ts", ".d.ts")
        // fs.writeFileSync(dts, createdFiles[dts]);
        // console.log(createdFiles)
        console.log({dts})
        // console.log(createdFiles[dts])
    })
}

// Run the compiler
// compile(['packages/any-event/src/index.ts'], {
//     allowJs: true,
//     declaration: true,
//     emitDeclarationOnly: true,
// });

const d = path.resolve('packages/any-event/src', '../dist')

console.log({d})