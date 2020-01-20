const fs = require('fs');
const path = require('path');
const PACKAGES_DIR = 'packages';
const dirNames = fs.readdirSync(PACKAGES_DIR);

module.exports = function(callback) {
    dirNames.forEach(dirName => {
        const dirPath = path.resolve(PACKAGES_DIR, dirName);
        const state = fs.statSync(dirPath);
        // 寻找包文件夹
        if (state.isDirectory()) {
            callback(dirName);
        }
    });
}