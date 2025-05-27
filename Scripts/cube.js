import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.122.0/examples/jsm/loaders/GLTFLoader.js';
import { camera, CurrentActiveCam, updateProgressBar } from './index.js';

let scene;
export let world;
const loaderGLTF = new GLTFLoader();
export const bodies = [];
let _objects = []; // Внутренний массив
export const originalMaterials = new Map();
export const referencePositions = new Map(); // Позиции эталонный позиций и кватернионов
// export const cubeState = new Map(); // Динамическая матрица состояния кубика
export let historyrotation = [];


let referenceCube = null;

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

    loaderGLTF.load("models/Cubuk-rubic_UltraLITE_withoutCamera.glb",
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(0,5,0)
            scene.add(model);

            referenceCube = gltf.scene.clone();
            referenceCube.scale.set(1, 1, 1)
            referenceCube.position.set(0, 5, 0)
            referenceCube.visible = false;
            scene.add(referenceCube)

            model.updateMatrixWorld(true)
            referenceCube.updateMatrixWorld(true)

            console.log('***Структура модели***');
            model.traverse(child => {
                if (child.isGroup || child.isMesh) {
                    const worldPos = new THREE.Vector3();
                    child.getWorldPosition(worldPos);
                    const worldQuat = new THREE.Quaternion();
                    child.getWorldQuaternion(worldQuat);
                    if (child.isGroup){
                        console.log(`Гр.: ${child.name}, Тип: ${child.type}, Поз. [${worldPos.x.toFixed(2)}, ${worldPos.y.toFixed(2)}, ${worldPos.z.toFixed(2)}], Кватернион: [${worldQuat.x.toFixed(2)}, ${worldQuat.y.toFixed(2)}, ${worldQuat.z.toFixed(2)}, ${worldQuat.w.toFixed(2)}]`);
                    }
                }
            });

            _objects.length = 0;
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
                            mesh.raycast = THREE.Mesh.prototype.raycast;
                        }
                    });
                    _objects.push(child);
                    const worldPos = new THREE.Vector3();
                    const worldQuat = new THREE.Quaternion();
                    child.getWorldPosition(worldPos);
                    child.getWorldQuaternion(worldQuat);
                    referencePositions.set(child.name, {
                        position: worldPos.clone(),
                        quaternion: worldQuat.clone()
                    });

                    console.log(` Полное обозначение Объекта: ${child.name}, Тип: ${child.type}, Позиция: [${worldPos.x.toFixed(2)}, ${worldPos.y.toFixed(2)}, ${worldPos.z.toFixed(2)}]`);
                    child.children.forEach(color => {
                        const colormat = color.material
                        console.log(`Название цвета: ${colormat.name}, цвет: ${colormat.color.toArray()}, тип: ${colormat.type} \n -------------------`)                                                
                    })
                }
            });

            console.log('***Эталонные позиции***');
            referencePositions.forEach((data, name) => {
                console.log(`ЭП Гр.: ${name} Позиция: [${data.position.x.toFixed(2)}, ${data.position.y.toFixed(2)}, ${data.position.z.toFixed(2)}] Кватернион: [${data.quaternion.x.toFixed(2)}, ${data.quaternion.y.toFixed(2)}, ${data.quaternion.z.toFixed(2)}, ${data.quaternion.w.toFixed(2)}]`);
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
            console.log(`bodies initialized, lenght: ${bodies.length}`)

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
        mass: 0,
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

//    console.log(`Слой по оси: ${axis}, координата: ${layerCoord}, кубиков: ${layerCubes.length}`);
    return { cubes: layerCubes };
}

export function checkFpsHit(){
    if (CurrentActiveCam !== 'player') return null;
    raycaster.setFromCamera(center, camera);
    return raycaster.intersectObjects(_objects, true)[0] || null        
}

export function rotateLayer(object, normal, isCounterclockwise = false) {
    return new Promise((resolve) => {
        if (isRotating || !object.parent || !normal.lengthSq()) {
            console.log('rotateLayer: blocked', { isRotating, hasParent: !!object.parent, normalLength: normal.lengthSq() });
            resolve();
            return;
        }
        // console.log('Вращение🔃: ', {
        //     object: object.name,
        //     normal: { x: normal.x, y: normal.y, z: normal.z },
        //     camMode: CurrentActiveCam,
        //     direction: isCounterclockwise ? 'против часовой' : 'по часовой'
        // });

        const layerData = getCubesInLayer(normal, object);
        cubesToRotate = layerData.cubes;

  //      console.log('rotateLayer: cubes to rotate=', cubesToRotate.length);
        if (cubesToRotate.length === 0) {
            console.log('rotateLayer: no cubes to rotate');
            resolve();
            return;
        }

        // Сохранение истории вращения
        historyrotation.push({
            type: 'layer',
            objectName: object.name,
            normal: normal.clone(),
            isCounterclockWise: isCounterclockwise
        })

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

        const targetAngle = isCounterclockwise ? -Math.PI / 2 : Math.PI / 2;
        const duration = 300;
        const startTime = performance.now();

        function animateRotation(currentTime) {
            if (!rotationGroup) {
                resolve();
                return;
            }
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const angle = targetAngle * progress;

            rotationGroup.rotation.set(0, 0, 0);
            rotationGroup.rotateOnAxis(rotationAxis, angle);

            if (progress < 1) {
                requestAnimationFrame(animateRotation);
            } else {
                finishRotation();
                resolve();
            }
        }

        requestAnimationFrame(animateRotation);
    });
}

export function rotateWholeCube(axis, isCounterclockwise = false) {
    return new Promise((resolve) => {
        if (isRotating) {
            console.log('rotateWholeCube: blocked, rotation in progress');
            resolve();
            return;
        }

        // Сохранение истории вращения
        historyrotation.push({
            type: 'whole',
            axis: axis.clone(),
            isCounterclockWise: isCounterclockwise
        })

        // Создаём группу для вращения
        rotationGroup = new THREE.Group();
        const centerPoint = new THREE.Vector3(0, 5, 0); // Центр кубика
        rotationGroup.position.copy(centerPoint);
        scene.add(rotationGroup);

        // Сохраняем начальные позиции и кватернионы всех кубиков
        const initialStates = new Map();
        _objects.forEach(cube => {
            const pos = new THREE.Vector3();
            cube.getWorldPosition(pos);
            const quat = cube.getWorldQuaternion(new THREE.Quaternion());
            initialStates.set(cube, { position: pos.clone(), quaternion: quat.clone() });
            // Перемещаем кубик в rotationGroup
            cube.position.copy(pos.sub(centerPoint));
            scene.remove(cube);
            rotationGroup.add(cube);
        });

        rotationAxis.copy(axis).normalize();
        isRotating = true;

        // Очищаем и создаём стрелки
        if (arrowHelper) {
            scene.remove(arrowHelper);
            arrowHelper = null;
        }
        progressArrows.forEach(arrow => scene.remove(arrow));
        progressArrows = [];
        updateProgressArrows(0);
        arrowHelper = new THREE.ArrowHelper(rotationAxis, rotationGroup.position, 2, 0xff0000);
        scene.add(arrowHelper);

        const targetAngle = isCounterclockwise ? -Math.PI / 2 : Math.PI / 2;
        const duration = 300;
        const startTime = performance.now();

        function animateRotation(currentTime) {
            if (!rotationGroup) {
                resolve();
                return;
            }
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const angle = targetAngle * progress;

            rotationGroup.rotation.set(0, 0, 0);
            rotationGroup.rotateOnAxis(rotationAxis, angle);

            updateProgressArrows(angle);

            if (progress < 1) {
                requestAnimationFrame(animateRotation);
            } else {
                finishWholeRotation(initialStates);
                resolve();
            }
        }

        requestAnimationFrame(animateRotation);
    });
}

function finishWholeRotation(initialStates) {
    if (!rotationGroup) return;

    // Переносим кубики обратно в сцену
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
        const worldQuat = cube.getWorldQuaternion(new THREE.Quaternion());

        // Округляем координаты и кватернионы
        worldPos.x = Math.round(worldPos.x * 1000) / 1000;
        worldPos.y = Math.round(worldPos.y * 1000) / 1000;
        worldPos.z = Math.round(worldPos.z * 1000) / 1000;
        worldQuat.x = Math.round(worldQuat.x * 1000) / 1000;
        worldQuat.y = Math.round(worldQuat.y * 1000) / 1000;
        worldQuat.z = Math.round(worldQuat.z * 1000) / 1000;
        worldQuat.w = Math.round(worldQuat.w * 1000) / 1000;

        tempContainer.remove(cube);
        scene.attach(cube);
        cube.position.copy(worldPos);
        cube.quaternion.copy(worldQuat);

        // Обновляем referencePositions для корректной работы других функций
        referencePositions.set(cube.name, {
            position: worldPos.clone(),
            quaternion: worldQuat.clone()
        });
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
    rotationGroup = null;
    cubesToRotate = []; // Очищаем, чтобы не мешать rotateLayer

    // Синхронизируем физику
    if (bodies.length > 0 && bodies[0] && bodies[0].body && bodies[0].mesh) {
        const centerPos = new THREE.Vector3(0, 5, 0);
        bodies[0].body.position.copy(new CANNON.Vec3(centerPos.x, centerPos.y, centerPos.z));
        bodies[0].mesh.position.copy(centerPos);
        // Кватернион физического тела не обновляем, так как вращение затрагивает только визуальные кубики
    }
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

    // физика
    if (bodies.length > 0 && bodies[0] && bodies[0].body && bodies[0].mesh){
        bodies[0].body.position.copy(new CANNON.Vec3(0, 5, 0));
        bodies[0].mesh.position.copy(new THREE.Vector3(0, 5, 0));
    }
}

export async function scrambleCube(numMoves = 20){
    if (isRotating){
        console.warn(`Перемешивание не может быть выполнено, т.к сейчас кубик вращается`);
        return;
    }

    const axes = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 1)
    ];

    for (let i = 0; i < numMoves; i++){
        const cube = _objects[Math.floor(Math.random() * _objects.length)];
        const axis = axes[Math.floor(Math.random() * axes.length)];
        const isCounterclockwise = Math.random() > 0.5;

        console.log(`Перемешивание: движение ${i+1}/${numMoves}: cube=${cube.name}, axis=${axis.toArray()}, direction=${isCounterclockwise ? 'против часовой' : 'по часовой'}`)
        await rotateLayer(cube, axis, isCounterclockwise);
    }
    console.log(`Перемешивание куба завершено-успешно`)
}

export async function solveCube() {
    if (isRotating) { alert("Сборка не может быть выполнена, т.к сейчас кубик вращается"); return; }

    optimizeHistory()
    
    // проходим по истории в обратном направлении
    for (let i = historyrotation.length - 1; i>=0; i--){
        const move = historyrotation[i];
        if (move.type === 'layer'){
            // находим объект по имени
            const object = _objects.find(obj => obj.name === move.objectName)
            if (!object){
                alert(`Объект: ${move.object} для вращения, не найден`)
            }
            await rotateLayer(object, move.normal, !move.isCounterclockWise); 
        } else if (move.type === 'whole'){
            await rotateWholeCube(move.axis, !move.isCounterclockWise)
        }
    }
    if (isCubeSolved()){
        console.log("Кубик собран, очищаем историю вращений");
        updateProgressBar(100);
        historyrotation = [];
    } else {
        console.warn("Кубик не собран после выполнения истории");
    }
    console.log("Сборка кубика завершена");
}

function optimizeHistory() {
    const optimized = [];
    for (let i = 0; i < historyrotation.length; i++) {
        const current = historyrotation[i];
        if (optimized.length > 0) {
            const last = optimized[optimized.length - 1];
            if (
                current.type === last.type &&
                current.objectName === last.objectName &&
                current.normal.equals(last.normal) &&
                current.isCounterclockwise === !last.isCounterclockwise
            ) {
                optimized.pop(); // Удаляем противоположные вращения
                continue;
            }
        }
        optimized.push(current);
    }
    historyrotation = optimized;
    console.log(`История оптимизирована, длина: ${historyrotation.length}`);
}


function isCubeSolved(){
    const tolerance = 0.01; // Допустимая погрешность для позиций и кватернионов
    let isSolved = true

    _objects.forEach(cube => {
        const refData = referencePositions.get(cube.name)
        if (!refData){
            console.warn(`Эталонные данные не найдены: ${cube.name}`);
            isSolved = false;
            return;
        }
        const currentPos = new THREE.Vector3();
        cube.getWorldPosition(currentPos);
        const currentQuat = cube.getWorldQuaternion(new THREE.Quaternion());

        // Округляем для сравнения
        currentPos.x = Math.round(currentPos.x * 1000) / 1000;
        currentPos.y = Math.round(currentPos.y * 1000) / 1000;
        currentPos.z = Math.round(currentPos.z * 1000) / 1000;
        currentQuat.x = Math.round(currentQuat.x * 1000) / 1000;
        currentQuat.y = Math.round(currentQuat.y * 1000) / 1000;
        currentQuat.z = Math.round(currentQuat.z * 1000) / 1000;
        currentQuat.w = Math.round(currentQuat.w * 1000) / 1000;

        const refPos = refData.position;
        const refQuat = refData.quaternion;

        // Проверяем позиции
        if (
            Math.abs(currentPos.x - refPos.x) > tolerance ||
            Math.abs(currentPos.y - refPos.y) > tolerance ||
            Math.abs(currentPos.z - refPos.z) > tolerance
        ) {
            console.log(`Кубик ${cube.name}: позиция не совпадает. Текущая: ${currentPos.toArray()}, Эталон: ${refPos.toArray()}`);
            isSolved = false;
        }

        // Проверяем ориентацию
        if (
            Math.abs(currentQuat.x - refQuat.x) > tolerance ||
            Math.abs(currentQuat.y - refQuat.y) > tolerance ||
            Math.abs(currentQuat.z - refQuat.z) > tolerance ||
            Math.abs(currentQuat.w - refQuat.w) > tolerance
        ) {
            console.log(`Кубик ${cube.name}: ориентация не совпадает. Текущая: ${[currentQuat.x, currentQuat.y, currentQuat.z, currentQuat.w]}, Эталон: ${[refQuat.x, refQuat.y, refQuat.z, refQuat.w]}`);
            isSolved = false;
        }
    });

    return isSolved;
}