import sleep from './utils/sleep';
import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);

test('仅有tap识别, 事件是否触发', () => {
    let panRecognize = at.get('pan');
    let is = panRecognize.isSupportHV();
    console.log(is);
});