var ghpages = require('gh-pages');
const shell = require('shelljs');

shell.exec(`rm -rf "./demo"`);
shell.exec(`mkdir "./demo/dist"`);
shell.exec(`cp dist/* "./demo/dist`);a
shell.exec(`mkdir "./demo/example"`);
shell.exec(`cp example/* "./demo/example"`);

// 发布
ghpages.publish('./demo', {
    branch: 'gh-pages',
}, (err) => {
    if(err) {
        console.log(err);
    } else {
        shell.exec(`rm -rf "./demo"`);
        console.log('gh-pages同步完成!');
    }
});