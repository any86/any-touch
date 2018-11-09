
import {
    PlaneGeometry, MeshBasicMaterial, Mesh
} from 'three';
export default function ({ color = '#ccc' }={}) {
    let planeGeometry = new PlaneGeometry(300,300);
    let planeMaterial = new MeshBasicMaterial({ color });
    let planeMesh = new Mesh(planeGeometry, planeMaterial);
    planeMesh.position.set(15,0,0);
    planeMesh.rotation.set(-10*Math.PI/180,0,0);
    planeMesh.receiveShadow = true;
    return planeMesh;
};