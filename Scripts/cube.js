import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.122.0/examples/jsm/loaders/GLTFLoader.js';
import { camera, controls, CurrentActiveCam } from './index.js';

let Planegeometry, Planematerial, PlaneCube
let scene;
export let world;
let selectedface = null;
let selectedObject = null;
let flash_speed = 2; // скорость мигания
let emissiveMin = 0; // минимальная интенсивность
let emissiveMax = 1; // максимальная интенсивность
let flash_on = false; // флаг мерцания
const loaderGLTF = new GLTFLoader();
export const bodies = []; // массив для физических тел
const objects = []; // двумерный массив
const Objects = []; // одномерный массив с объектами
let raycaster = new THREE.Raycaster();
let rotationGroup = [];
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let cubesToRotate = [];
let selectedNormal = null; // Нормаль выбранной грани для вращения
export let mouse = new THREE.Vector2();
const center = new THREE.Vector2(); // центр экрана 0, 0
let arrowHelper = null;

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
let threerotationGroup = new THREE.Group();

// для обозначения выбраного кубика
let cursorSelected = document.createElement('div');
cursorSelected.id = 'selected-cursor';
document.body.appendChild(cursorSelected)

// функции событий
function handleGlobalMouse(event){
    console.log('hgMClick: ', event)
    // обработка только ПКМ и ЛКМ
    
    // блок контекс-меню для ПКМ
    if (event.button === 2) event.preventDefault();

    // вызов общего отработчика
    handleCubeClick(event);
}

// Измените функцию handleGlobalMouseMove
function handleGlobalMouseMove(event) {
    if (!isRotating || !rotationGroup) return;
        
    const currentMousePosition = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );
    
    const delta = currentMousePosition.clone().sub(startMousePosition);
    const rotationAngle = delta.length() * Math.PI;
    
    if (rotationAngle > 0) {
        rotationGroup.rotation.set(0, 0, 0);
        rotationGroup.rotateOnAxis(rotationAxis, delta.x > 0 ? rotationAngle : -rotationAngle);
    }   
}

function handleGlobalMouseUp(event){
    if (!isRotating) return;
        
    // Вычисляем ближайший угол 90 градусов
    const angle = rotationGroup.rotation.toVector3().dot(rotationAxis);
    const targetAngle = Math.round(angle / (Math.PI/2)) * (Math.PI/2);
    const deltaAngle = targetAngle - angle;
    
    // Анимация завершения вращения
    const duration = 300; // ms
    const startTime = performance.now();
    
    function animateCompletion(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentDelta = deltaAngle * progress;
        
        rotationGroup.rotation.set(0, 0, 0);
        rotationGroup.rotateOnAxis(rotationAxis, angle + currentDelta);
        
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

export function initCube(sceneArg, rendererArg, controlsArg, controlsPointerArg, cameraArg, worldArg) {
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

function getCubesInLayer(normal, clickedObject) {
    const layerCubes = [];
    const threshold = 0.9;
//  const cubeSize = 1.0; // Размер одного кубика
    
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

        if (Math.round(cubePos[axis]) === layerCoord){
            layerCubes.push(cube)
        }       
     
    });
    
    return { cubes: layerCubes };
}

function handleCubeClick(event){
    console.log('hCubeClick: ', 'isRotating: '+isRotating,'Objects.length: '+Objects.length)
    if (!Objects.length) return;

    const isRotationAction = event.button === 0

    // устанавливаем мышь(mouse) в зависимости от камеры
    if (CurrentActiveCam === 'player'){
        mouse.copy(center)
    } else {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
    }

    raycaster.setFromCamera(mouse, camera);   
    const intersects = raycaster.intersectObjects(Objects, true);

    if (intersects.length > 0) {
        const intersect = intersects[0];

        // выделение/сброс выделения
        if (selectedObject) {
            selectedObject.material.emissive.setHex(0x000000);
            flash_on = false;
        }
        
        // выделение нового объекта
        selectedObject = intersect.object;
        selectedObject.material.emissive.setHex(isRotationAction ? 0xff0000 : 0x0f00ff);
        flash_on = !isRotationAction;

        // вращение слоя 
        console.log('проверка на истиность: ',isRotationAction && intersect.face && intersect.face.normal)
        if (isRotationAction && intersect.face && intersect.face.normal) {
            console.log('Начинаем вращение. Нормаль: ', intersect.face.normal)
            startMousePosition.set(event.clientX, event.clientY)
            rotateLayer(intersect.object, intersect.face.normal);
        }
        
        if (isRotationAction) flashobject();
    }
}

function flashobject() {
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
            
            if (flash_on) {
                requestAnimationFrame(flashobject);
            }
        }
    }
}

function rotateLayer(object, normal) {
    if (isRotating || !object.parent) return;
    console.log('Вращение🔃: ', {
        object: object.name,
        normal: {x: normal.x, y: normal.y, z: normal.z},
        camMode: CurrentActiveCam
    });
    
    const layerData = getCubesInLayer(normal, object);
    cubesToRotate = layerData.cubes;
    
    if (cubesToRotate.length === 0) return;
    
    // Удаляем предыдущий arrowHelper, если он есть
    if (arrowHelper) {
        scene.remove(arrowHelper);
        arrowHelper = null;
    }
    
    // Создаем группу для вращения
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

    // Создаем новый arrowHelper
    arrowHelper = new THREE.ArrowHelper(
        rotationAxis,
        rotationGroup.position, 
        2, 0xff0000
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

        tempContainer.remove(cube);
        scene.attach(cube);
        cube.position.copy(worldPos);
        cube.quaternion.copy(tempContainer.quaternion);
    }

    scene.remove(tempContainer);
    if (arrowHelper) {
        scene.remove(arrowHelper);
        arrowHelper = null;
    }
    scene.remove(rotationGroup);
    isRotating = false;
    cubesToRotate = [];
    rotationGroup = null;
}