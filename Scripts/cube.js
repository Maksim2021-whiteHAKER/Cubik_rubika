import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.122.0/examples/jsm/loaders/GLTFLoader.js';
import { camera, CurrentActiveCam } from './index.js';

let scene;
export let world;
const loaderGLTF = new GLTFLoader();
export const bodies = [];
let _objects = []; // Внутренний массив
export const originalMaterials = new Map();

const validGroups = [
    'R1_GWR001', 'R2_WR002', 'R3_RWB003', 'R4_GR004', 'R5_CENTER_R005', 'R6_RB006', 'R7_GRY007', 'R8_RY008', 'R9_RBY009',
    'Mid1_GW001', 'Mid2_CENTER_W002', 'Mid3_WB003', 'Mid4_CENTER_G004', 'Mid5_CENTER_B005', 'Mid6_CENTER_B006', 'Mid7_YG007', 'Mid8_CENTER_Y008', 'Mid9_YB009',
    'O1_GOW001', 'O2_OW002', 'O3_OBW003', 'O4_GO004', 'O5_CENTER_O005', 'O6_OB006', 'O7_GYO007', 'O8_YO008', 'O9_OYB009'
];

// Getter для Objects
export function getObjects() {
    return _objects;
}

let rotationGroup = null;
let cubesToRotate = [];
let arrowHelper = null;
let progressArrows = [];
let isRotating = false;
let rotationAxis = new THREE.Vector3();

export function initCube(sceneArg, worldArg, onLoadCallback) {
    scene = sceneArg;
    world = worldArg;

    initCannon();

    loaderGLTF.load(
        "models/Cubik-Rubik_LITE_without_camera.glb",
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            scene.add(model);

            console.log('***Структура модели***');
            model.traverse(child => {
                if (child.isGroup || child.isMesh) {
                    const worldPos = new THREE.Vector3();
                    child.getWorldPosition(worldPos);
                    console.log(`Объект: ${child.name}, Тип: ${child.type}, Позиция: [${worldPos.x.toFixed(2)}, ${worldPos.y.toFixed(2)}, ${worldPos.z.toFixed(2)}]`);
                }
            });

            _objects.length = 0; // Очищаем
            model.traverse(child => {
                if (child.isGroup && validGroups.includes(child.name)) {
                    child.traverse(mesh => {
                        if (mesh.isMesh) {
                            const clonedMaterial = mesh.material.clone();
                            if (mesh.material.emissive) {
                                clonedMaterial.emissive = mesh.material.emissive.clone();
                                clonedMaterial.emissiveIntensity = mesh.material.emissiveIntensity;
                            }
                            if (mesh.material.map) clonedMaterial.map = mesh.material.map;
                            originalMaterials.set(mesh.uuid, clonedMaterial);
                            mesh.castShadow = true;
                            mesh.receiveShadow = true;
                            mesh.material.emissiveIntensity = 0;
                            mesh.geometry.computeVertexNormals();
                            if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
                            console.log(`Mesh: ${mesh.name}, Geometry: ${mesh.geometry.type}, Material: ${mesh.material.name}`);
                            // Принудительно включаем raycast
                            mesh.raycast = THREE.Mesh.prototype.raycast;
                        }
                    });
                    _objects.push(child);
                }
            });

            console.log('initCube: Objects filled, length=', _objects.length);
            _objects.forEach((obj, i) => {
                console.log(`Object ${i}: ${obj.name}, Children: ${obj.children.length}`);
            });

            const body = new CANNON.Body({
                mass: 1,
                position: new CANNON.Vec3(0, 5, 0),
                shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
            });
            world.addBody(body);
            bodies.push({ mesh: model, body });

            if (onLoadCallback) onLoadCallback();
        },
        undefined,
        (error) => {
            console.error("Ошибка загрузки модели:", error);
        }
    );
}

export function initCannon() {
    world = new CANNON.World();
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
    const groundBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 0, 0),
        shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);
}

export function getCubesInLayer(normal, clickedObject) {
    const layerCubes = [];
    const threshold = 0.9;

    const clickedPos = new THREE.Vector3();
    clickedObject.getWorldPosition(clickedPos);

    const axis = Math.abs(normal.x) > threshold ? 'x' :
                 Math.abs(normal.y) > threshold ? 'y' : 'z';

    let layerCoord = Math.round(clickedPos[axis]);

    _objects.forEach(cube => {
        const cubePos = new THREE.Vector3();
        cube.getWorldPosition(cubePos);
        if (Math.abs(cubePos[axis] - layerCoord) < 0.1) {
            layerCubes.push(cube);
        }
    });

    console.log(`Слой по оси: ${axis}, координата: ${layerCoord}, кубиков: ${layerCubes.length}`);
    return { cubes: layerCubes };
}

export function checkFpsHit(){
    if (CurrentActiveCam !== 'player') return null;
    raycaster.setFromCamera(center, camera);
    return raycaster.intersectObjects(_objects, true)[0] || null        
}

export function rotateLayer(object, normal) {
    if (isRotating || !object.parent || !normal.lengthSq()) {
        console.log('rotateLayer: blocked', { isRotating, hasParent: !!object.parent, normalLength: normal.lengthSq() });
        return;
    }
    console.log('Вращение🔃: ', {
        object: object.name,
        normal: { x: normal.x, y: normal.y, z: normal.z },
        camMode: CurrentActiveCam
    });

    const layerData = getCubesInLayer(normal, object);
    cubesToRotate = layerData.cubes;

    console.log('rotateLayer: cubes to rotate=', cubesToRotate.length);
    if (cubesToRotate.length === 0) {
        console.log('rotateLayer: no cubes to rotate');
        return;
    }

    if (arrowHelper) {
        scene.remove(arrowHelper);
        arrowHelper = null;
    }
    progressArrows.forEach(arrow => scene.remove(arrow));
    progressArrows = [];

    rotationGroup = new THREE.Group();
    const centerPoint = new THREE.Vector3();
    cubesToRotate.forEach(cube => {
        const pos = new THREE.Vector3();
        cube.getWorldPosition(pos);
        centerPoint.add(pos);
    });
    centerPoint.divideScalar(cubesToRotate.length);

    rotationGroup.position.copy(centerPoint);
    scene.add(rotationGroup);

    cubesToRotate.forEach(cube => {
        const pos = new THREE.Vector3();
        cube.getWorldPosition(pos);
        cube.position.copy(pos.sub(centerPoint));
        scene.remove(cube);
        rotationGroup.add(cube);
    });

    rotationAxis.copy(normal).normalize();
    isRotating = true;

    updateProgressArrows(0);
    arrowHelper = new THREE.ArrowHelper(rotationAxis, rotationGroup.position, 2, 0xff0000);
    scene.add(arrowHelper);

    const targetAngle = Math.PI / 2;
    const duration = 300;
    const startTime = performance.now();

    function animateRotation(currentTime) {
        if (!rotationGroup) return;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const angle = targetAngle * progress;

        rotationGroup.rotation.set(0, 0, 0);
        rotationGroup.rotateOnAxis(rotationAxis, angle);

        if (progress < 1) {
            requestAnimationFrame(animateRotation);
        } else {
            finishRotation();
        }
    }

    requestAnimationFrame(animateRotation);
}

function updateProgressArrows(currentAngle) {
    progressArrows.forEach(arrow => scene.remove(arrow));
    progressArrows = [];

    const progress = Math.min(Math.abs(currentAngle) / (Math.PI / 2), 1);
    const startColor = new THREE.Color(0xff0000);
    const endColor = new THREE.Color(0x00ff00);
    const arrowColor = startColor.clone().lerp(endColor, progress);

    const arrowLength = 2 + progress * 1;
    const arrow1 = new THREE.ArrowHelper(rotationAxis, rotationGroup.position, arrowLength, arrowColor.getHex(), 0.3, 0.1);
    scene.add(arrow1);
    progressArrows.push(arrow1);

    const arrow2 = new THREE.ArrowHelper(rotationAxis.clone().negate(), rotationGroup.position, arrowLength, arrowColor.getHex(), 0.3, 0.1);
    scene.add(arrow2);
    progressArrows.push(arrow2);
}

function finishRotation() {
    if (!rotationGroup) return;

    cubesToRotate.forEach(cube => {
        cube.traverse(child => {
            if (child.isMesh && originalMaterials.has(child.uuid)) {
                child.material = originalMaterials.get(child.uuid).clone();
                child.material.needsUpdate = true;
                child.geometry.computeVertexNormals();
                if (child.material.emissive) {
                    child.material.emissiveIntensity = 0;
                }
            }
        });
    });

    const tempContainer = new THREE.Group();
    scene.add(tempContainer);
    tempContainer.position.copy(rotationGroup.position);
    tempContainer.quaternion.copy(rotationGroup.quaternion);

    while (rotationGroup.children.length > 0) {
        const cube = rotationGroup.children[0];
        const originalPos = new THREE.Vector3().copy(cube.position);
        rotationGroup.remove(cube);
        tempContainer.add(cube);
        cube.position.copy(originalPos);
    }

    while (tempContainer.children.length > 0) {
        const cube = tempContainer.children[0];
        const worldPos = new THREE.Vector3();
        cube.getWorldPosition(worldPos);
        const worldQuater = cube.getWorldQuaternion(new THREE.Quaternion());

        worldPos.x = Math.round(worldPos.x * 1000) / 1000;
        worldPos.y = Math.round(worldPos.y * 1000) / 1000;
        worldPos.z = Math.round(worldPos.z * 1000) / 1000;
        worldQuater.x = Math.round(worldQuater.x * 1000) / 1000;
        worldQuater.y = Math.round(worldQuater.y * 1000) / 1000;
        worldQuater.z = Math.round(worldQuater.z * 1000) / 1000;
        worldQuater.w = Math.round(worldQuater.w * 1000) / 1000;

        tempContainer.remove(cube);
        scene.attach(cube);
        cube.position.copy(worldPos);
        cube.quaternion.copy(worldQuater);
    }

    scene.remove(tempContainer);
    if (arrowHelper) {
        scene.remove(arrowHelper);
        arrowHelper = null;
    }
    progressArrows.forEach(arrow => scene.remove(arrow));
    progressArrows = [];
    scene.remove(rotationGroup);
    isRotating = false;
    cubesToRotate = [];
    rotationGroup = null;
}