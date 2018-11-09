const box = document.createElement('div');
box.id = 'box';
// import AnyTouch from '../../src/main';
import {
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    BoxGeometry,
    MeshBasicMaterial, DirectionalLight,
    FontLoader,
    TextGeometry, SpotLight, SpotLightHelper,
    MeshPhongMaterial, PointLight, AmbientLight,
    Mesh
} from 'three';
import createPlane from './geometrys/plane';

// 场景
let scene = new Scene()

let camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 600;



// import './fonts/Alex.json'
var loader = new FontLoader();
loader.load(`./Alex.json`, function (font) {

    // 形状
    let geometry = new TextGeometry('Hell123o', {
        font,
        height: 20,
        // bevelEnabled:true,ack
        // bevelThickness:1,
    });

    var ambientLight = new AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    // 光
    {
        let spotLight = new SpotLight(0xffffff, 1);
        spotLight.castShadow = true;
        spotLight.position.set(-10, 100, 100);
        scene.add(spotLight);
        var spotLightHelper = new SpotLightHelper(spotLight);
        scene.add(spotLightHelper);
    }

    {
        let spotLight = new SpotLight(0xffffff, 1);
        spotLight.castShadow = true;
        spotLight.position.set(10, -100, 100);
        scene.add(spotLight);
        var spotLightHelper = new SpotLightHelper(spotLight);
        scene.add(spotLightHelper);
    }

    // 材质
    let material = new MeshPhongMaterial({
        // map: texture,
        color: 0xeeeeee,
        specular: 0xeeeeee,
        shininess: 97,
    });
    //3D文字材质
    var mesh = new Mesh(geometry, material);

    mesh.rotateX(.3);
    mesh.rotateY(.3);
    // mesh.rotateZ(1);

    // 加入到场景中
    scene.add(mesh);

    scene.add(createPlane());

    let renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);


    document.body.appendChild(box)
    box.appendChild(renderer.domElement);
    renderer.setClearColor(0xaaaaaa);
    renderer.shadowMap.enabled = true;
    renderer.render(scene, camera);
});




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