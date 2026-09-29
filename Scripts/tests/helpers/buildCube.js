// Scripts/tests/helpers/buildCube.js
import * as THREE from 'three';
import { cube } from '../../state.js';

const STEP = 2.04;         // 6.12 / 3
const CENTER_Y = 5;        // как в loader.js

export function buildCube() {
    // Сброс синглтона
    cube.scene = new THREE.Scene();
    cube.objects = [];
    cube.staticObjects = [];
    cube.referenceDynamicObjects = [];
    cube.cubesToRotate = [];
    cube.historyrotation = [];
    cube.isRotating = false;
    cube.isScrambling = false;
    cube.progressArrows = [];
    cube.arrowHelper = null;
    cube.rotationAxis = new THREE.Vector3();
    cube.rotationGroup = null;
    cube.originalMaterials = new Map();
    cube.referencePositions = new Map();
    cube.bodies = [];
    cube.world = { addBody: () => {}, removeBody: () => {} };

    const colors = ['red', 'orange', 'green', 'blue', 'white', 'yellow'];
    let i = 0;

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                const g = new THREE.Group();
                g.position.set(x * STEP, y * STEP + CENTER_Y, z * STEP);
                g.name = `Cube_${x}${y}${z}`;

                // Меш нужен, чтобы traverse/raycast работали
                const mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(STEP, STEP, STEP),
                    new THREE.MeshBasicMaterial({ name: colors[i % 6] })
                );
                g.add(mesh);

                cube.scene.add(g);
                cube.objects.push(g);
                i++;
            }
        }
    }

    cube.scene.updateMatrixWorld(true);

    // Статичный «эталон» — копия исходных позиций
    cube.staticObjects = cube.objects.map(o => {
        const clone = new THREE.Group();
        clone.name = o.name;
        clone.position.copy(o.position);
        clone.quaternion.copy(o.quaternion);
        clone.children.push(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()));
        return clone;
    });
}