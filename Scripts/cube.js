// Scripts/cube.js
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import DRACOLoader from './lib/DRACOLoader.js';
import { cLog, cWarn } from './utils/logger.js';
import { three, app, game } from './state.js';
import { updateProgressBar } from './ui.js';

let scene;
export let world;
const loaderGLTF = new GLTFLoader();
const LoaderDraco = new DRACOLoader();

LoaderDraco.setDecoderPath('draco/');
loaderGLTF.setDRACOLoader(LoaderDraco);

export const bodies = [];
let _objects = []; // Внутренний массив
let _staticobjects = []; // эталлоные объекты
let _referenceDynamicObjects = []; // эталонные объекты для динамики
export const originalMaterials = new Map();
export const referencePositions = new Map(); // Позиции эталонный позиций и кватернионов
export let historyrotation = [];
const raycaster = new THREE.Raycaster()
export let isScrambling = false;

document.getElementById('debugCheckButton').addEventListener('click', debugCheckCube);

export let referenceCube = null;

const validGroups = [
    'R1_GWR001', 'R2_WR002', 'R3_RWB003', 'R4_GR004', 'R5_CENTER_R005', 'R6_RB006', 'R7_GRY007', 'R8_RY008', 'R9_RBY009',
    'Mid1_GW001', 'Mid2_CENTER_W002', 'Mid3_WB003', 'Mid4_CENTER_G004', 'Mid5_CENTER_Black005', 'Mid6_CENTER_B006', 'Mid7_YG007', 'Mid8_CENTER_Y008', 'Mid9_YB009',
    'O1_GOW001', 'O2_OW002', 'O3_OBW003', 'O4_GO004', 'O5_CENTER_O005', 'O6_OB006', 'O7_GYO007', 'O8_YO008', 'O9_OYB009'
]

const colorThemes = {
    'classic':{
        'red': 0xff0000,
        'green': 0x00ff00,
        'blue': 0x0000ff,
        'white': 0xffffff,
        'yellow': 0xffff00,
        'orange':0xffa500,
        'black': 0x111111
    },

    'neon':{
        'red': 0xFF0F3A,       //# Ярче оригинального (смещен в пурпурный спектр)
        'green': 0x3AFF0F,     //# Более кислотный оттенок (смещен в желтый)
        'blue': 0x0F7BFF,      //# Электрический синий (чистый тон)
        'white': 0xFFFFFF,     //# Максимальная яркость
        'yellow': 0xFFFF0F,    //# Чистый желтый без примесей
        'orange': 0xFF4F0F,    //# Насыщенный "огненный" оранж
        'black': 0x0A0A0A      //# Глубокий черный для контраста
    },

    'monochrome':{
        'black': 0x080808,
        'red': 0x2E2E2E,
        'orange': 0x505050,
        'green': 0x787878,
        'blue': 0xA0A0A0,
        'yellow': 0xC8C8C8,
        'white': 0xF0F0F0
    },
}

const NO_COLOR_OVERLAY_THEME = {
    'black': 0xf0f0f0,  // Очень светлый серый
    'red': 0xf0f0f0,
    'orange': 0xf0f0f0,
    'green': 0xf0f0f0,
    'blue': 0xf0f0f0,
    'yellow': 0xf0f0f0,
    'white': 0xf0f0f0
}


/**
 * Применяет выбраную цветовую схему ко всем цветовым плоскостям кубика.
 * @param {string} themeName Название темы из объекта colorThemes.
 */

export function applyColorTheme(themeName) {
    let theme;    
    if (themeName === 'non_cassat'){
        theme = NO_COLOR_OVERLAY_THEME;
    } else {
        theme = colorThemes[themeName];
        if (!theme) {
            cWarn(`Тема "${themeName}" не найдена.`);
            return;
        }
    }

    cLog(`Применение цветовой темы: ${themeName}`);

    const objects = getObjects(); // Получаем массив динамических объектов (_objects)

    objects.forEach(group => { // Проходим по каждой группе (мини-кубику)
        group.traverse(mesh => { // Проходим по каждому мешу внутри группы
             if (mesh.isMesh) {
                 // 2. Идентификация цвета
                 // Предполагаем, что имя материала в .glb соответствует цвету.
                 // Это самый надежный способ, если вы экспортировали модель с такими именами.
                 const materialName = mesh.material.name ? mesh.material.name.toLowerCase() : '';
                 let colorKey = null;

                 // Сопоставляем имя материала с ключом темы
                 // Вам нужно проверить cLog из initCube, чтобы точно знать имена материалов
                 if (materialName.includes('red') || materialName.includes('красн')) {
                     colorKey = 'red';
                 } else if (materialName.includes('green') || materialName.includes('зелен') || materialName.includes('GREEN.003')) {
                     colorKey = 'green';
                 } else if (materialName.includes('blue') || materialName.includes('син') || materialName.includes('BLUE.006')) {
                     colorKey = 'blue';
                 } else if (materialName.includes('white') || materialName.includes('бел') || materialName.includes('WHITE.005')) {
                     colorKey = 'white';
                 } else if (materialName.includes('yellow') || materialName.includes('желт') || materialName.includes('YELLOW.002')) {
                     colorKey = 'yellow';
                 } else if (materialName.includes('orange') || materialName.includes('оранж') || materialName.includes('ORANGE.007')) {
                     colorKey = 'orange';
                 } else if (materialName.includes('black') || materialName.includes('черн') || materialName.includes('BLACK.004')) {
                     colorKey = 'black';
                 } else {
                     // Если имя материала не распознано, можно пропустить или вывести предупреждение
                     cWarn(`Не удалось определить цвет для материала: ${materialName} у меша ${mesh.name}`);
                     return; // Пропускаем этот меш
                 }

                 // 3. Применение цвета
                 if (colorKey && theme[colorKey] !== undefined) {
                     // Получаем новый цвет из темы
                     const newColorHex = theme[colorKey];

                     // Меняем цвет у оригинального материала меша (видимый цвет)
                     mesh.material.color.set(newColorHex);
                     mesh.material.needsUpdate = true; // Сообщаем Three.js об изменении

                     // Меняем цвет в сохраненном оригинальном материале
                     // Это важно, если вы используете originalMaterials для сброса эффектов или
                     // если они используются где-то еще. Также обеспечивает корректную работу
                     // при последующих переключениях тем.
                     const originalMat = originalMaterials.get(mesh.uuid);
                     if (originalMat) {
                         originalMat.color.set(newColorHex);
                         originalMat.needsUpdate = true;
                     }
                     // cLog(`Меняем цвет меша ${mesh.name} (${materialName}) на ${colorKey}: #${newColorHex.toString(16).padStart(6, '0')}`);
                 }
             }
        });
    });
    cLog(`Цветовая тема "${themeName}" применена.`);
}

// Getter для Objects
export function getObjects() {
    return _objects;
}

export function getstaticObjects(){
    return _staticobjects;
}

export function getReferenceDynamicObjects(){
    return _referenceDynamicObjects;
}

let rotationGroup = null;
let cubesToRotate = [];
let arrowHelper = null;
let progressArrows = [];
let isRotating = false;
let dontRepeat = false;
let rotationAxis = new THREE.Vector3();

export function initCube(sceneArg, worldArg, onLoadCallback) {
    scene = sceneArg;
    world = worldArg;

    initCannon();

    loaderGLTF.load("models/Cubuk-rubic_UltraLITE_withoutCamera_rounded250FixPos_grbowy_fullFixCompress.glb",
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            // model.position.set(0, 5 ,0)
            scene.add(model);

            loaderGLTF.load("models/Cubik-Rubik_LITE_without_camera_fixCenterPosition.glb", (refgltf) => {
                referenceCube = refgltf.scene;
                referenceCube.scale.set(1, 1, 1)
                referenceCube.position.set(0, 5, 0)
                referenceCube.visible = false;
                scene.add(referenceCube)
            
                _staticobjects.length = 0;
                _referenceDynamicObjects.length = 0;
                referenceCube.traverse(child => {
                    if (child.isGroup && validGroups.includes(child.name)) {
                        child.userData.index = _staticobjects.length;
                        _staticobjects.push(child);
                        _referenceDynamicObjects.push(child);
                    }
                });

                _staticobjects.sort((a, b) => a.name.localeCompare(b.name))
                _referenceDynamicObjects.sort((a, b) => a.name.localeCompare(b.name));

                model.updateMatrixWorld(true)
                referenceCube.updateMatrixWorld(true)
            })

            // Модель - динамика
            // cLog('***Структура модели***');
            model.traverse(child => {
                if (child.isGroup || child.isMesh) {
                    const worldPos = new THREE.Vector3();
                    child.getWorldPosition(worldPos);
                    const roundedPos = new THREE.Vector3(
                        Math.round(worldPos.x * 100) / 100, 
                        Math.round(worldPos.y * 100) / 100, 
                        Math.round(worldPos.z * 100) / 100
                    )
                    
                    // Применяем округлённые координаты
                    if (child.parent === scene) {
                        child.position.set(roundedPos.x, roundedPos.y, roundedPos.z);
                    } else {
                        // Для вложенных объектов: пересчитываем локальную позицию
                        const localPos = child.parent.worldToLocal(roundedPos);
                        child.position.copy(localPos);
                    }

                    // Обновляем матрицу объекта
                    child.updateMatrix();
                    child.updateMatrixWorld(true);                    
            
                    const worldQuat = new THREE.Quaternion();
                    child.getWorldQuaternion(worldQuat);
                    if (child.isGroup && child.name !== 'Scene' ){
                        // cLog(`Гр.: ${child.name}, Тип: ${child.type}, Поз. [${worldPos.x.toFixed(2)}, ${worldPos.y.toFixed(2)}, ${worldPos.z.toFixed(2)}], Кватернион: [${worldQuat.x.toFixed(2)}, ${worldQuat.y.toFixed(2)}, ${worldQuat.z.toFixed(2)}, ${worldQuat.w.toFixed(2)}]`);
                        // cLog(`(без окр.) Гр.: ${child.name}, Тип: ${child.type}, Поз. [${worldPos.x}, ${worldPos.y}, ${worldPos.z}], Кватернион: [${worldQuat.x}, ${worldQuat.y}, ${worldQuat.z}, ${worldQuat.w}]`);
                        // cLog(`Гр.: ${child.name}, Тип: ${child.type}, Поз. [${roundedPos.x}, ${roundedPos.y}, ${roundedPos.z}], Кватернион: [${worldQuat.x}, ${worldQuat.y}, ${worldQuat.z}, ${worldQuat.w}]`);
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
                    child.userData.index = _objects.length;
                    _objects.push(child);

                    // эталонны
                    const worldPos = new THREE.Vector3();
                    const worldQuat = new THREE.Quaternion(); 
                    child.getWorldPosition(worldPos);
                    const roundedPos = new THREE.Vector3(
                        Math.round(worldPos.x * 100)/100, 
                        Math.round(worldPos.y * 100)/100,
                        Math.round(worldPos.z * 100)/100
                    )
                    child.getWorldQuaternion(worldQuat);
                    referencePositions.set(child.name, {
                        position: roundedPos.clone(),
                        quaternion: worldQuat.clone()
                    });

                    // cLog(` Полное обозначение Объекта: ${child.name}, Тип: ${child.type}, Позиция: [${worldPos.x.toFixed(2)}, ${worldPos.y.toFixed(2)}, ${worldPos.z.toFixed(2)}]`);
                    // cLog(` Полное обозначение Объекта: ${child.name}, Тип: ${child.type}, Позиция: [${worldPos.x}, ${worldPos.y}, ${worldPos.z}]`);
                    // child.children.forEach(color => {
                    //     // const colormat = color.material
                    //     // cLog(`Название цвета: ${colormat.name}, цвет: ${colormat.color.toArray()}, тип: ${colormat.type} \n -------------------`)                                                
                    // })
                }
            });

            _objects.sort((a, b) => a.name.localeCompare(b.name))
            // cLog('Модель - динамика',_objects)
            // cLog('Эталлоны ',_staticobjects)

            // cLog('***Эталонные позиции***');
            referencePositions.forEach((data, name) => {
                // cLog(`ЭП Гр.: ${name} Позиция: [${data.position.x.toFixed(2)}, ${data.position.y.toFixed(2)}, ${data.position.z.toFixed(2)}] Кватернион: [${data.quaternion.x.toFixed(2)}, ${data.quaternion.y.toFixed(2)}, ${data.quaternion.z.toFixed(2)}, ${data.quaternion.w.toFixed(2)}]`);
                // cLog(`ЭП Гр.: ${name} Позиция: [${data.position.x}, ${data.position.y}, ${data.position.z}] Кватернион: [${data.quaternion.x}, ${data.quaternion.y}, ${data.quaternion.z}, ${data.quaternion.w}]`);
            });
            cLog('initCube: Objects filled, length=', _objects.length);
            _objects.forEach((obj, i) => {
                // cLog(`Object ${i}: ${obj.name}, Children: ${obj.children.length}`);
            });

            const body = new CANNON.Body({
                mass: 1,
                position: new CANNON.Vec3(0, 5, 0),
                shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
            });
            world.addBody(body);
            bodies.push({ mesh: model, body });
            // cLog(`bodies initialized, lenght: ${bodies.length}`)

            
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

//    cLog(`Слой по оси: ${axis}, координата: ${layerCoord}, кубиков: ${layerCubes.length}`);
    return { cubes: layerCubes };
}

export function checkFpsHit(mousePos) {
    if (app.CurrentActiveCam !== 'player') return null;
    // Используем координаты мыши вместо центра экрана
    three.cameraPlayer.updateMatrixWorld(true);

    raycaster.setFromCamera(mousePos || new THREE.Vector2(0, 0), three.cameraPlayer);
    const intersects = raycaster.intersectObjects(_objects, true);
    const validIntersect = intersects.find(i => _objects.some(cube => i.object.parent === cube || i.object === cube))
    return validIntersect || null;
}

export function rotateLayer(object, normal, isCounterclockwise = false) {
    return new Promise((resolve) => {
        if (isRotating || !object.parent || !normal.lengthSq()) {
            cLog('rotateLayer: blocked', { isRotating, hasParent: !!object.parent, normalLength: normal.lengthSq() });
            resolve();
            return;
        }
        // cLog('Вращение🔃: ', {
        //     object: object.name,
        //     normal: { x: normal.x, y: normal.y, z: normal.z },
        //     camMode: app.CurrentActiveCam,
        //     direction: isCounterclockwise ? 'против часовой' : 'по часовой'
        // });

        const speedRotate = app.speedSet;
        const layerData = getCubesInLayer(normal, object);
        cubesToRotate = layerData.cubes;

        // cLog('rotateLayer: cubes to rotate=', cubesToRotate.length);
        if (cubesToRotate.length === 0) {
            cLog('rotateLayer: no cubes to rotate');
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
        const duration =  speedRotate;
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
                cLog("вращение: " + isRotating);
                finishRotation();
                cLog("завершено вр.: "+ isRotating)
                if (!isScrambling) { // <-- Не обновляем прогресс во время перемешивания                   
                    if (isCubeSolved()){ // Проверяем, собран ли кубик
                        historyrotation = [];
                        cLog('Куб собран');
                    }
                }       
                resolve();
            }
        }

        requestAnimationFrame(animateRotation);

        const audio = document.getElementById('rotation_sound');
        audio.currentTime = 0;
        if (game.state_sounds === 2 || game.state_sounds === 3){
            audio.play().catch(e => console.error('не удалось загрузить музыку'));
        }
    });
}

export async function rotateWholeCube(axis, isCounterclockwise = false) {
    return new Promise((resolve) => {
        if (isRotating) {
            cLog('rotateWholeCube: blocked, rotation in progress');
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
                if (!isScrambling) { // <-- Не обновляем прогресс во время перемешивания
                     if (isCubeSolved()){ // Проверяем, собран ли кубик
                        historyrotation = [];
                        cLog('Куб собран');
                    }
                }      
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

    if (!isScrambling && game.active) {
        // Используем обновленную логику isCubeSolved
        isCubeSolved(false);
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


    if (!isScrambling && game.active) {
        // Используем обновленную логику isCubeSolved
        isCubeSolved(false);
    }
}

export async function scrambleCube(numMoves = 20){
    if (isRotating){
        cWarn(`Перемешивание не может быть выполнено, т.к сейчас кубик вращается`);
        return;
    }
    isScrambling = true; // включаем перемешивание
    updateProgressBar(0)

    const axes = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 1)
    ];

    for (let i = 0; i < numMoves; i++){
        const cube = _objects[Math.floor(Math.random() * _objects.length)];
        const axis = axes[Math.floor(Math.random() * axes.length)];
        const isCounterclockwise = Math.random() > 0.5;

        cLog(`Перемешивание: движение ${i+1}/${numMoves}: cube=${cube.name}, axis=${axis.toArray()}, direction=${isCounterclockwise ? 'против часовой' : 'по часовой'}`)
        await rotateLayer(cube, axis, isCounterclockwise);
    }
    cLog(`Перемешивание куба завершено-успешно`)
    isScrambling = false
}

function waitForRotationToFinish() {
    dontRepeat = false;
    return new Promise(resolve => {
        const check = () => {
            if (!isRotating) { 
                updateProgressBar(0); 
                resolve();                 
            }
            else { 
                if (dontRepeat === false) alert("Пожалуйста, подождите — кубик завершает вращение.");
                dontRepeat = true;
                setTimeout(check, 50); 
            }
        };
        check();
    });
}

export async function solveCube() {
    if (isRotating) { await waitForRotationToFinish();}           
    if (game.mode === 'normal' && game.exitMenu === false ) { alert("Недоступно в обычном режиме"); updateProgressBar(0); return ;} 

    // optimizeHistory()
    
    game.exitMenu === false ? alert("Начата сборка") : 0;
    
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
        cLog("Кубик собран, очищаем историю вращений");
        game.exitMenu === false ? updateProgressBar(100) : updateProgressBar(0);
        historyrotation = [];
    } else {
        cWarn("Кубик не собран после выполнения истории");
    }
    cLog("Сборка кубика завершена");
}

// function optimizeHistory() {
//     const optimized = [];
//     for (let i = 0; i < historyrotation.length; i++) {
//         const current = historyrotation[i];
//         if (optimized.length > 0) {
//             const last = optimized[optimized.length - 1];
//             if (
//                 current.type === last.type &&
//                 current.objectName === last.objectName &&
//                 current.normal.equals(last.normal) &&
//                 current.isCounterclockwise === !last.isCounterclockwise
//             ) {
//                 optimized.pop(); // Удаляем противоположные вращения
//                 continue;
//             }
//         }
//         optimized.push(current);
//     }
//     historyrotation = optimized;
//     cLog(`История оптимизирована, длина: ${historyrotation.length}`);
// }

export function checkCubeSolved(){
    return isCubeSolved()
}

function isCubeSolved(debugMode = false) {
    if (_objects.length !== _staticobjects.length) {
        cWarn(`Разная длина массивов: dynamic=${_objects.length}, static=${_staticobjects.length}`);
        const result = debugMode ? { 
            isSolved: false, 
            progress: 0,
            unsolvedObjects: [`Разная длина массивов: dynamic=${_objects.length}, static=${_staticobjects.length}`] 
        } : false;
        updateProgressBar(0);
        return result;
    }
    
    if (app.isMouseDown === true) {
        return debugMode ? { isSolved: false, progress: 0, unsolvedObjects: [] } : false;
    }

    // Список центральных кубиков, для которых игнорируем проверку кватернионов
    const centerCubes = [
        'Mid2_CENTER_W002',
        'Mid4_CENTER_G004',
        'Mid5_CENTER_Black005',
        'Mid6_CENTER_B006',
        'Mid8_CENTER_Y008',
        'R5_CENTER_R005',
        'O5_CENTER_O005',
    ];  

    let correctCubes = 0;
    let isSolved = true;
    const unsolvedObjects = [];
    const isDefaultTheme = game.selector_theme?.value === 'default'

    _objects.forEach((dynamicCube, index) => {
        const staticCube = _staticobjects[index];

        // Проверка имени
        if (dynamicCube.name !== staticCube.name) {
            cWarn(`Имена не совпадают: dynamic=${dynamicCube.name}, static=${staticCube.name} на индексе ${index}`);
            isSolved = false;
            unsolvedObjects.push(`Имена не совпадают: dynamic=${dynamicCube.name}, static=${staticCube.name}`);
            return;
        }

        // Проверка позиций
        const dynamicPos = new THREE.Vector3();
        dynamicCube.getWorldPosition(dynamicPos);
        const staticPos = new THREE.Vector3();
        staticCube.getWorldPosition(staticPos);

        const posTolerance = 0.01;
        const positionCorrect = 
            Math.abs(dynamicPos.x - staticPos.x) <= posTolerance &&
            Math.abs(dynamicPos.y - staticPos.y) <= posTolerance &&
            Math.abs(dynamicPos.z - staticPos.z) <= posTolerance;

        if (!positionCorrect) {
            isSolved = false;
            unsolvedObjects.push(`Позиции не совпадают для ${dynamicCube.name}: Dynamic=[${dynamicPos.x.toFixed(3)}, ${dynamicPos.y.toFixed(3)}, ${dynamicPos.z.toFixed(3)}], Static=[${staticPos.x.toFixed(3)}, ${staticPos.y.toFixed(3)}, ${staticPos.z.toFixed(3)}]`);
        }

        // Проверка кватернионов
        let orientationCorrect = true;
        if (!centerCubes.includes(dynamicCube.name) || (centerCubes.includes(dynamicCube.name) && !isDefaultTheme)) {
            const dynamicQuat = dynamicCube.getWorldQuaternion(new THREE.Quaternion());
            const staticQuat = staticCube.getWorldQuaternion(new THREE.Quaternion());
            const angleTolerance = 0.01; // Радианы
            const angleDiff = dynamicQuat.angleTo(staticQuat);
            orientationCorrect = angleDiff <= angleTolerance;
            
            if (!orientationCorrect) {
                isSolved = false;
                unsolvedObjects.push(`Кватернионы не совпадают для ${dynamicCube.name}: Dynamic=[${dynamicQuat.x.toFixed(3)}, ${dynamicQuat.y.toFixed(3)}, ${dynamicQuat.z.toFixed(3)}, ${dynamicQuat.w.toFixed(3)}], Static=[${staticQuat.x.toFixed(3)}, ${staticQuat.y.toFixed(3)}, ${staticQuat.z.toFixed(3)}, ${staticQuat.w.toFixed(3)}]`);
            }
        }

        // Проверка количества дочерних объектов
        if (dynamicCube.children.length !== staticCube.children.length) {
            cWarn(`Разное количество дочерних объектов для ${dynamicCube.name}: dynamic=${dynamicCube.children.length}, static=${staticCube.children.length}`);
            isSolved = false;
            unsolvedObjects.push(`Разное количество дочерних объектов для ${dynamicCube.name}: dynamic=${dynamicCube.children.length}, static=${staticCube.children.length}`);
        }

        // Кубик считается правильным только если и позиция и ориентация правильные
        if (positionCorrect && orientationCorrect) {
            correctCubes++;
        }
    });

    // вычисление процента %
    const totalCubes = _objects.length;
    const progressPercentage = totalCubes > 0 ? (correctCubes / totalCubes) * 100 : 0;

    cLog(`Прогресс: ${correctCubes}/${totalCubes} кубиков правильно (${progressPercentage.toFixed(2)}%)`);

    if (isSolved) {
        cLog('✅ Кубик собран по позициям и кватернионам!');
    } else {
        // cWarn('❌ Кубик не собран.');
    }

    // Обновляем прогресс-бар только если игра активна и не идет перемешивание
    if (!isScrambling && game.active) {
        updateProgressBar(progressPercentage);
    }

    return debugMode ? { 
        isSolved, 
        progress: progressPercentage,
        unsolvedObjects 
    } : isSolved;
}

function debugCheckCube() {
    const result = isCubeSolved(true);
    // const result = compareModels(_objects, _staticobjects); // true — возвращает подробный результат
    cLog('test: ', result.isSolved)
    if (result.isSolved) {
        cLog('✅ Куб собран!');
        alert('✅ Куб собран!');
    } else {
        cWarn('❌ Куб НЕ собран:');
        cWarn(result.unsolvedObjects);
        alert(`❌ Куб НЕ собран:\n${result.unsolvedObjects.join('\n')}`);
    }
}