const box = document.createElement('div');
box.id = 'box';
// import AnyTouch from '../../src/main';
import {
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    MeshBasicMaterial, DirectionalLight,
    TextGeometry, SpotLight, SpotLightHelper,
    PointLight, AmbientLight,
    AxesHelper,
    Object3D
} from 'three';
import createPlane from './object3D/plane';
import createFont from './object3D/font';
import createSphere from './object3D/sphere';

// 渲染器
let renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(box)
box.appendChild(renderer.domElement);
renderer.setClearColor(0xaaaaaa);
renderer.shadowMap.enabled = true;


let position = { x: 188, y: 36, z: 210 };
const dat = require('dat.gui');
const gui = new dat.GUI();
gui.add(position, 'x', -1000, 1000);
gui.add(position, 'y', -1000, 1000);
gui.add(position, 'z', -1000, 1000);


// 场景
let scene = new Scene()

// 相机
let camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 100;
camera.position.y = 100;
camera.position.z = 400;
camera.lookAt(scene.position)

// 辅助线
scene.add(new AxesHelper(130));
// 平面
scene.add(createPlane());

// 球体
// scene.add(createSphere());

// 光源

let spotLight = new SpotLight(0xffffff);
spotLight.position.set(-40, 60, 300);
spotLight.castShadow = true;
scene.add(spotLight);



!async function () {
    //3D文字
    const fontMesh = <Object3D>await createFont();
    scene.add(fontMesh);
    

    function render3() {
        requestAnimationFrame(render3);
        scene.remove(spotLight);
        spotLight = new SpotLight(0xffffff);
        spotLight.position.set(position.x, position.y, position.z);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // 开始渲染
        renderer.render(scene, camera);
    }
    render3();
}();

// const log = console.log;
// const tap2 = new AnyTouch.TapRecognizer({ name: 'doubletap', pointer: 1, taps: 2 })
// const tap3 = new AnyTouch.TapRecognizer({ name: 'threetap', pointer: 1, taps: 3 })
// const anyTouch = new AnyTouch(box);
// anyTouch.add(tap2);
// anyTouch.add(tap3);
// const tap1 = anyTouch.get('tap');
// tap1.requireFailure(tap2);
// tap1.requireFailure(tap3);
// tap2.requireFailure(tap3);
// /**
//  * =========================== pan ===========================
//  */
// // anyTouch.on('tap', e => {
// //     console.log(`%c ${e.type} `, 'background-color:#f10;color:#fff;');
// // });

// // anyTouch.on('doubletap', e => {
// //     console.log(`%c ${e.type} `, 'background-color:#9c3;color:#fff;');
// // });

// // anyTouch.on('threetap', e => {
// //     console.log(`%c ${e.type} `, 'background-color:#99c;color:#fff;');
// // });
// anyTouch.on('panright', e => {
//     // console.warn(e.type);
// });