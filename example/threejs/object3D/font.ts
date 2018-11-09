
import { FontLoader, TextGeometry, MeshPhongMaterial, Mesh, Object3D } from 'three';
export default () => new Promise((resolve, reject) => {
    try {
        const loader = new FontLoader();
        loader.load(`./Alex.json`, function (font) {
            // 文字
            let geometry = new TextGeometry('Soufeel', {
                font,
                height: 10,
                bevelSize: 1,
                bevelEnabled: true,
                bevelThickness: 1,
            });

            // 材质
            let material = new MeshPhongMaterial({
                // map: texture,
                color: 0xd16a0e,
                specular: 0xd16a0e,
                shininess: 97,
            });
            //3D文字材质
            let mesh = new Mesh(geometry, material);
            resolve(<Object3D>mesh);
        });
    } catch (error) {
        reject(error);
    }
});