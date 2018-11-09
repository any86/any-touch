
import {
    PlaneGeometry, MeshBasicMaterial, Mesh
} from 'three';
export default function ({ color = '#ccc' }={}) {
    let planeGeometry = new PlaneGeometry(200, 60);
    let planeMaterial = new MeshBasicMaterial({ color });
    let planeMesh = new Mesh(planeGeometry, planeMaterial);
    planeMesh.rotation.set(45,45,45);
    return planeMesh;
};