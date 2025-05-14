import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.122.0/examples/jsm/loaders/GLTFLoader.js';
import { camera, controls, CurrentActiveCam } from './index.js';

let scene;
export let world;
let selectedObject = null;
let marker_on = false; // флаг маркера
const loaderGLTF = new GLTFLoader();
export const bodies = []; // массив для физических тел
const Objects = []; // одномерный массив с объектами
let raycaster = new THREE.Raycaster();
let rotationGroup = null;
let previousMousePosition = { x: 0, y: 0 };
let cubesToRotate = [];
let selectedNormal = null; // Нормаль выбранной грани для вращения
export let mouse = new THREE.Vector2();
const center = new THREE.Vector2(); // центр экрана 0, 0
let arrowHelper = null;
let progressArrows = []

export const originalMaterials = new Map();

const validGroups = [
    // R - RED - Красный
    'R1_GWR001', 'R2_WR002', 'R3_RWB003', 'R4_GR004', 
    'R5_CENTER_R005', 'R6_RB006', 'R7_GRY007', 'R8_RY008', 'R9_RBY009',
    // Mid - Middle - Средний
    'Mid1_GW001', 'Mid2_CENTER_W002', 'Mid3_WB003', 'Mid4_CENTER_G004',
    'Mid5_CENTER_B005', 'Mid6_CENTER_B006', 'Mid7_YG007', 'Mid8_CENTER_Y008', 'Mid9_YB009',
    // O - Orange - Оранжевый
    'O1_GOW001', 'O2_OW002', 'O3_OBW003', 'O4_GO004',
    'O5_CENTER_O005', 'O6_OB006', 'O7_GYO007', 'O8_YO008', 'O9_OYB009'
];

// для вращения
let isRotating = false;
let startMousePosition = new THREE.Vector2();
let rotationAxis = new THREE.Vector3();

// для обозначения выбраного кубика
let cursorSelected = document.createElement('div');
cursorSelected.id = 'selected-cursor';
document.body.appendChild(cursorSelected)

// функции событий
function handleGlobalMouse(event){
    console.log('hgMClick: ', event)    
    // блок контекс-меню для ПКМ и вызов общего отработчика
    if (event.button === 2) event.preventDefault();
    handleCubeClick(event);
}

let mouseHistory = [];
function handleGlobalMouseMove(event) {
    if (!isRotating || !rotationGroup) return;

    const currentMousePosition = new THREE.Vector2(event.clientX, event.clientY);

    // Сглаживание: храним последние 5 позиций мыши
    mouseHistory.push(currentMousePosition.clone());
    if (mouseHistory.length > 5) mouseHistory.shift();

    // Вычисляем среднюю позицию
    const avgMousePosition = new THREE.Vector2(0, 0);
    mouseHistory.forEach(pos => avgMousePosition.add(pos));
    avgMousePosition.divideScalar(mouseHistory.length);

    const delta = avgMousePosition.clone().sub(startMousePosition);

    // Порог для игнорирования мелких движений
    const movementThreshold = 3;
    if (delta.length() < movementThreshold) return;

    // Определяем доминирующую ось движения мыши
    const axisThreshold = 1.5;
    let dominantAxis = 'none';
    if (Math.abs(delta.x) > Math.abs(delta.y) * axisThreshold) {
        dominantAxis = 'x';
        delta.y = 0;
    } else if (Math.abs(delta.y) > Math.abs(delta.x) * axisThreshold) {
        dominantAxis = 'y';
        delta.x = 0;
    } else {
        return; // Игнорируем нечёткие движения
    }

    // Вычисляем угол вращения
    const rotationSpeed = 0.015;
    let rotationAngle = delta.length() * rotationSpeed;

    // Определяем направление движения мыши
    const mouseDir = delta.clone().normalize();

    // Получаем векторы направления камеры
    const cameraDir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const cameraUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

    // Определяем направление вращения
    let direction = 0;
    if (Math.abs(rotationAxis.x) > 0.9) {
        // Вращение по x (боковые слои, например, левая/правая грань)
        if (dominantAxis === 'y') {
            // Вертикальное движение: вращение вверх/вниз
            direction = -mouseDir.y * Math.sign(rotationAxis.x) * Math.sign(cameraRight.dot(new THREE.Vector3(1, 0, 0)));
        } else if (dominantAxis === 'x') {
            // Горизонтальное движение: вращение влево/вправо
            direction = mouseDir.x * Math.sign(rotationAxis.x) * Math.sign(cameraDir.dot(new THREE.Vector3(0, 0, -1)));
        }
    } else if (Math.abs(rotationAxis.y) > 0.9) {
        // Вращение по y (верх/низ)
        if (dominantAxis === 'x') {
            // Горизонтальное движение: вращение влево/вправо
            direction = mouseDir.x * Math.sign(rotationAxis.y) * Math.sign(cameraRight.dot(new THREE.Vector3(1, 0, 0)));
        } else if (dominantAxis === 'y') {
            // Вертикальное движение: вращение вверх/вниз
            direction = -mouseDir.y * Math.sign(rotationAxis.y) * Math.sign(cameraUp.dot(new THREE.Vector3(0, 1, 0)));
        }
    } else if (Math.abs(rotationAxis.z) > 0.9) {
        // Вращение по z (перед/зад)
        if (dominantAxis === 'x') {
            // Горизонтальное движение: вращение влево/вправо
            direction = -mouseDir.x * Math.sign(rotationAxis.z) * Math.sign(cameraUp.dot(new THREE.Vector3(0, 1, 0)));
        } else if (dominantAxis === 'y') {
            // Вертикальное движение: вращение вверх/вниз
            direction = mouseDir.y * Math.sign(rotationAxis.z) * Math.sign(cameraRight.dot(new THREE.Vector3(1, 0, 0)));
        }
    }

    rotationAngle *= Math.sign(direction);
    if (Math.abs(rotationAngle) < 0.001) return;

    // Применяем вращение
    rotationGroup.rotateOnAxis(rotationAxis, rotationAngle);

    // Обновляем стрелки прогресса
    if (typeof updateProgressArrows === 'function') {
        updateProgressArrows(rotationAngle);
    }

    // Обновляем начальную позицию
    startMousePosition.copy(avgMousePosition);

    // Отладка
    console.log(`Движение мыши: delta=${delta.x},${delta.y}, dominantAxis=${dominantAxis}, direction=${direction}, angle=${rotationAngle}, axis=${rotationAxis.toArray()}, degrees=${rotationAngle * 180 / Math.PI}`);
}

function updateProgressArrows(currentAngle) {
    // Удаляем старые стрелки
    progressArrows.forEach(arrow => scene.remove(arrow));
    progressArrows = [];

    // Вычисляем прогресс (0–1) до ближайшего угла 90°
    const targetAngle = Math.round(currentAngle / (Math.PI / 2)) * (Math.PI / 2);
    const progress = Math.min(Math.abs(currentAngle) / (Math.PI / 2), 1);

    // Определяем цвета
    const startColor = new THREE.Color(0xff0000); // Красный
    const endColor = new THREE.Color(0x00ff00);   // Зелёный
    const arrowColor = startColor.clone().lerp(endColor, progress);

    // Создаём две стрелки
    const arrowLength = 5 + progress * 2; // Длина от 1 до 3
    // Положительная стрелка
    const arrow1 = new THREE.ArrowHelper(
        rotationAxis,
        rotationGroup.position,
        arrowLength,
        arrowColor.getHex(),
        0.3,
        0.1
    );
    scene.add(arrow1);
    progressArrows.push(arrow1);

    // Отрицательная стрелка
    const arrow2 = new THREE.ArrowHelper(
        rotationAxis.clone().negate(),
        rotationGroup.position,
        arrowLength,
        arrowColor.getHex(),
        0.3,
        0.1
    );
    scene.add(arrow2);
    progressArrows.push(arrow2);
}

function handleGlobalMouseUp(event){
    if (!isRotating) return;
        
    // Вычисляем ближайший угол 90 градусов
    const currentAngle = rotationGroup.rotation.toVector3().dot(rotationAxis);
    const targetAngle = Math.round(currentAngle / (Math.PI/2)) * (Math.PI/2);
    
    // Анимация завершения вращения
    const duration = 300; // ms
    const startTime = performance.now();
    
    function animateCompletion(currentTime) {
        if (!rotationGroup) return;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const angle = currentAngle + (targetAngle - currentAngle) * progress;
        
        rotationGroup.rotation.set(0, 0, 0);
        rotationGroup.rotateOnAxis(rotationAxis, angle);
        
        if (progress < 1) {
            requestAnimationFrame(animateCompletion);
        } else {
            finishRotation();
        }
    }
    
    requestAnimationFrame(animateCompletion);
}

// события
window.addEventListener('mousedown', handleGlobalMouse)
window.addEventListener('mousemove', handleGlobalMouseMove);
window.addEventListener('mouseup',   handleGlobalMouseUp);
window.addEventListener('contextmenu', (event)=> event.preventDefault())

export function checkFpsHit(){
    if (CurrentActiveCam !== 'player') return null;
    raycaster.setFromCamera(center, camera);
    return raycaster.intersectObjects(Objects, true)[0] || null        
}

export function initCube(sceneArg, worldArg) {
    scene = sceneArg;
    world = worldArg;
    
    initCannon();

    loaderGLTF.load("models/Cubik-Rubik_LITE_without_camera.glb", (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        scene.add(model);

        model.traverse(child => {
            if (child.isGroup && validGroups.includes(child.name)) {
                child.traverse(mesh => {
                    if (mesh.isMesh) {
                        // Глубокое клонирование материала
                        const clonedMaterial = mesh.material.clone();
                        // Сохраняем все важные свойства
                        if (mesh.material.emissive) {
                            clonedMaterial.emissive = mesh.material.emissive.clone();
                            clonedMaterial.emissiveIntensity = mesh.material.emissiveIntensity;
                        }
                        // Сохраняем текстуры
                        if (mesh.material.map) clonedMaterial.map = mesh.material.map;                   
                        originalMaterials.set(mesh.uuid, clonedMaterial);
                        // Настройка свойств меша
                        mesh.castShadow = true;
                        mesh.material.emissiveIntensity = 0;
                        mesh.geometry.computeVertexNormals()                        
                    }
                });
                Objects.push(child);
            }
        });

        // Физическое тело
        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(0, 5, 0),
            shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
        });
        world.addBody(body);
        bodies.push({ mesh: model, body });

    }, undefined, (error) => {
        console.error("Ошибка загрузки модели:", error);
    });
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

// функция получения кубов в слое (Размер одного кубика = 1)
function getCubesInLayer(normal, clickedObject) {
    const layerCubes = [];
    const threshold = 0.9;

    const clickedPos = new THREE.Vector3();
    clickedObject.getWorldPosition(clickedPos);

    const axis = Math.abs(normal.x) > threshold ? 'x' :
                 Math.abs(normal.y) > threshold ? 'y' : 'z';
    
    // Определяем координату слоя
    let layerCoord = Math.round(clickedPos[axis]);
    
    // Собираем все кубики в слое
    Objects.forEach(cube => {
        const cubePos = new THREE.Vector3();
        cube.getWorldPosition(cubePos);
        if (Math.abs(cubePos[axis] - layerCoord) < 0.1){
            layerCubes.push(cube)
        }       
    });
    
    console.log(`Слой по оси: ${axis}, координата: ${layerCoord}, кубиков: ${layerCubes.length}`)
    return { cubes: layerCubes };
}

function handleCubeClick(event) {
    console.log('hCubeClick: ', 'isRotating: ' + isRotating, 'Objects.length: ' + Objects.length);
    if (!Objects.length) return;

    const isRotationAction = event.button === 0;

    // Устанавливаем мышь (mouse) в зависимости от камеры
    if (CurrentActiveCam === 'player') {
        mouse.copy(center);
    } else {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
    }
    console.log("Координаты мыши: ", mouse);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(Objects, true);

    if (intersects.length > 0) {
        const intersect = intersects[0];

        // Выделение/сброс выделения
        if (selectedObject) {
            selectedObject.material.emissive.setHex(0x000000);
            marker_on = false;
        }

        // Выделение нового объекта
        selectedObject = intersect.object;
        selectedObject.material.emissive.setHex(isRotationAction ? 0xff0000 : 0x0f00ff);
        marker_on = !isRotationAction;

        // Вращение слоя
        if (isRotationAction && intersect.face && intersect.face.normal) {
            console.log('Начинаем вращение. Нормаль: ', intersect.face.normal);
            // Преобразование локальной нормали в глобальную
            const localNormal = intersect.face.normal.clone();
            const worldNormal = localNormal.applyMatrix4(intersect.object.matrixWorld).normalize();

            // Позиция клика
            const clickedPos = intersect.point; // Используем точку пересечения

            // Определяем ось вращения на основе позиции клика
            let alignedNormal;
            let axis;
            let layerCoord;

            // Определяем, какой слой выбран
            if (Math.abs(clickedPos.y) > 0.9) {
                // Верхний или нижний слой (y = ±1)
                axis = new THREE.Vector3(0, Math.sign(clickedPos.y), 0); // [0, 1, 0] или [0, -1, 0]
                layerCoord = Math.round(clickedPos.y);
                alignedNormal = axis.clone();
            } else if (Math.abs(clickedPos.x) > 0.9) {
                // Боковой слой (x = ±1)
                axis = new THREE.Vector3(Math.sign(clickedPos.x), 0, 0); // [1, 0, 0] или [-1, 0, 0]
                layerCoord = Math.round(clickedPos.x);
                alignedNormal = axis.clone();
            } else if (Math.abs(clickedPos.z) > 0.9) {
                // Передний или задний слой (z = ±1)
                axis = new THREE.Vector3(0, 0, Math.sign(clickedPos.z)); // [0, 0, 1] или [0, 0, -1]
                layerCoord = Math.round(clickedPos.z);
                alignedNormal = axis.clone();
            } else {
                // Средний слой или неопределённый
                // Используем нормаль, если клик не на грани
                const absX = Math.abs(worldNormal.x);
                const absY = Math.abs(worldNormal.y);
                const absZ = Math.abs(worldNormal.z);
                alignedNormal = new THREE.Vector3(
                    absX > absY && absX > absZ ? Math.sign(worldNormal.x) : 0,
                    absY > absX && absY > absZ ? Math.sign(worldNormal.y) : 0,
                    absZ > absX && absZ > absY ? Math.sign(worldNormal.z) : 0
                ).normalize();
                axis = alignedNormal.clone();
                layerCoord = Math.round(clickedPos.x * axis.x + clickedPos.y * axis.y + clickedPos.z * axis.z);
            }

            console.log("Инфо", {
                "Глобальная нормаль: ": worldNormal.toArray(),
                "Выравненная нормаль: ": alignedNormal.toArray(),
                "Координаты нажатия: ": clickedPos.toArray(),
                "Ось вращения: ": axis.toArray(),
                "Координата слоя: ": layerCoord
            });

            startMousePosition.set(event.clientX, event.clientY);
            rotateLayer(intersect.object, axis);
        }
        if (isRotationAction) markerobject();
    } else {
        console.log("Пересечений с объектами не найдено");
    }
}

function markerobject() {
    if (selectedObject && selectedObject.material && selectedObject.material.emissive) {
        if (CurrentActiveCam === 'observer'){
            let PosCube = new THREE.Vector3();
            selectedObject.getWorldPosition(PosCube);

            // преобразуем мировые координаты в экранные
            PosCube.project(camera)

            // Переводим экранные координаты в пиксели
            const x = (PosCube.x * window.innerWidth) / 2 + window.innerWidth / 2;
            const y = -(PosCube.y * window.innerHeight) / 2 + window.innerHeight / 2;

            // Обновляем положение курсора
            cursorSelected.style.left = `${x}px`;
            cursorSelected.style.top  = `${y+50}px`;
            cursorSelected.style.display = 'block';
            
            if (marker_on) {
                requestAnimationFrame(markerobject);
            }
        }
    }
}

function rotateLayer(object, normal) {
    if (isRotating || !object.parent) return;
    console.log('Вращение🔃: ', {
        object: object.name,
        normal: { x: normal.x, y: normal.y, z: normal.z },
        camMode: CurrentActiveCam,
        CubesInLayer: cubesToRotate.length
    });

    const layerData = getCubesInLayer(normal, object);
    cubesToRotate = layerData.cubes;

    if (cubesToRotate.length === 0) return;

    // Удаляем предыдущий arrowHelper, если он есть
    if (arrowHelper) {
        scene.remove(arrowHelper);
        arrowHelper = null;
    }

    // Удаляем предыдущие стрелки прогресса
    progressArrows.forEach(arrow => scene.remove(arrow));
    progressArrows = [];

    // Создаём группу для вращения
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

    // Создаём начальные стрелки прогресса
    updateProgressArrows(0);

    // Создаём новый arrowHelper
    arrowHelper = new THREE.ArrowHelper(
        rotationAxis,
        rotationGroup.position,
        2,
        0xff0000
    );
    scene.add(arrowHelper);
}

// Измените функцию finishRotation
function finishRotation() {
    if (!rotationGroup) return;

    cubesToRotate.forEach(cube => {
        cube.traverse(child => {
            if (child.isMesh && originalMaterials.has(child.uuid)) {
                // Восстанавливаем материал из хранилища
                child.material = originalMaterials.get(child.uuid).clone();
                
                // Обновляем свойства
                child.material.needsUpdate = true;
                child.geometry.computeVertexNormals();
                
                // Для материалов с эмиссией
                if (child.material.emissive) {
                    child.material.emissiveIntensity = 0.5; // Значение по умолчанию
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
        const worldQuater = cube.getWorldQuaternion(new THREE.Quaternion())

        // Округляем позиции и кватернионы
        worldPos.x = Math.round(worldPos.x * 1000) / 1000;
        worldPos.y = Math.round(worldPos.y * 1000) / 1000;
        worldPos.z = Math.round(worldPos.z * 1000) / 1000;
        worldQuater.x = Math.round(worldQuater.x * 1000) / 1000
        worldQuater.y = Math.round(worldQuater.y * 1000) / 1000
        worldQuater.z = Math.round(worldQuater.z * 1000) / 1000
        worldQuater.w = Math.round(worldQuater.w * 1000) / 1000

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
    // Удаляем стрелки прогресса
    progressArrows.forEach(arrow => scene.remove(arrow));
    progressArrows = [];
    scene.remove(rotationGroup);
    isRotating = false;
    cubesToRotate = [];
    rotationGroup = null;
}