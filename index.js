// const path = require('path');
// console.log(path.resolve(__dirname, './src/AnyTouch'))
const fs =require('fs');
const sta = fs.existsSync(`./dist`);
console.log(sta);