var ghpages = require('gh-pages');
const shell = require('shelljs');

let dest = 'demo';
// shell.exec(`mkdir ${dest}`);
// shell.exec(`mv dist/* ${dest}`);
// shell.exec(`mv example/* ${dest}`);

// 发布
ghpages.publish(dest, {
    branch: 'gh-pages',
}, function(err) {
  console.log('demo同步gh-pages完成!');
});