import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import Stats from 'https://unpkg.com/three@0.122.0/examples/jsm/libs/stats.module.js';
import { OrbitControls } from '../Scripts/lib/OrbitControls.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/PointerLockControls.js';
import { initCube, world, bodies, getObjects, scrambleCube, solveCube, rotateLayer, rotateWholeCube, getstaticObjects, getReferenceDynamicObjects } from './cube.js';
import { initPlayer } from './player.js';
import { createTriggerZones } from './cubeInteraction.js';
import { gameState, congratsModal, stopTimer, togglePauseMenu, updateHelpContent } from './menu.js';

export let scene, camera, controlsPointer, observerCamera, cameraPlayer, renderer, controls;
export let CurrentActiveCam = 'observer';
let stats;
let textureLoader = new THREE.TextureLoader();
let texture_grass = textureLoader.load("https://threejs.org/examples/textures/terrain/grasslight-big.jpg");
document.getElementById('menu_settings').style.display = 'none';
let orbitControlSet = document.getElementById('OrbitConSet')
let isDragging = false;
let startObject = null;
const raycaster = new THREE.Raycaster();
let arrows = []; // Массив для стрелок
let selectedCube = null;

// сопоставление цвета грани на повороты
const rotationMap = {
    0xff0000: { 0x00ff00: [Math.PI, 0, 0], 0xffff00: [0, 0, -Math.PI], 0x0000ff: [Math.PI, 0, 0] }, // Красная грань
    0x00ff00: { 0x00ff00: [Math.PI, 0, 0], 0xffff00: [0, 0, Math.PI / 2], 0x0000ff: [0, 0, -Math.PI / 2] }, // Зеленая грань
    0xffffff: { // белая грань
        0xff0000: [Math.PI / 2, 0, -Math.PI / 2], // Красная стрелка ↑
        0x00ff00: [Math.PI / 2, 0, -Math.PI / 2], // Зеленая стрелка ↓
        0x0000ff: [-Math.PI / 2, 0, -Math.PI / 2],// Синяя   стрелка →
        0xffff00: [Math.PI / 2, 0, -Math.PI / 2], // Желтая  стрелка ←
    },
    0xffff00: { // Желтая грань
        0xff0000: [Math.PI / 2, 0, Math.PI / 2],
        0x00ff00: [Math.PI / 2, 0, Math.PI / 2],
        0x0000ff: [-Math.PI / 2, 0, Math.PI / 2],
        0xffff00: [Math.PI, 0, Math.PI / 2],
    },
    0x0000ff: { // Синяя грань
        0x00ff00: [0, 0, Math.PI],
        0x0000ff: [-Math.PI / 2, 0, Math.PI / 2],
        0xffff00: [Math.PI / 2, 0, -Math.PI / 2],
    },
    0xffa500: { /* Оранжевая грань */ 0x00ff00: [Math.PI, 0, 0] }
};

// переменные для управления мышью
export let isMouseDown = false;
let rotationInProgress = false; 
let startX = 0, startY = 0;
let selectedCubeForMouse = null;
const rotationDelay = 150;
const MOUSE_CONTROL_SENSITIVITY = 5;

// переменные для телефона
let currentTouches = [];
let isPinching = false;
let isOrbiting = false;
let initialPinchDistance = 0;
let initialOrbitCenter = new THREE.Vector2();
let initialOrbitRotation = 0;
let initialOrbitDistance = 0;
let initialOrbitTarget = new THREE.Vector3();

export function getDeviceType(){
    if (navigator.maxTouchPoints > 0){
        return 'touch' // сенсорное уст.
    }
    return 'desktop'
}

export const isTouchDevice = getDeviceType() === 'touch';

function updateControlModeSelector(){
    const controlModeSelect = document.getElementById('theme-select_2');
    if (!controlModeSelect) {console.warn('элемент controlModeSelect не найден'); return;}

    const deviceType = getDeviceType();
    const allowedTouchModes = ['control_touch_trigger', 'control_touch_move'];
    
    if (deviceType === 'touch'){
        // селектор изменен на сенсор
        
        let triggerOpt = Array.from(controlModeSelect.options).find(opt => opt.value === allowedTouchModes[0]);
        let newOptionMove = Array.from(controlModeSelect.options).find(opt => opt.value === allowedTouchModes[1]);
        
        if (!triggerOpt){
            triggerOpt = document.createElement('option');
            triggerOpt.value = allowedTouchModes[0];
            triggerOpt.textContent = 'Сенсорное управление(Триггер)';
            controlModeSelect.add(triggerOpt);
        }
       
        if (!newOptionMove){
            newOptionMove = document.createElement('option');
            newOptionMove.value = allowedTouchModes[1];
            newOptionMove.textContent = 'Сенсорное управление(Палец)';
            controlModeSelect.add(newOptionMove)
        }

        Array.from(controlModeSelect.options).forEach(option => {
            if (!allowedTouchModes.includes(option.value)){
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        });

        if (!allowedTouchModes.includes(controlModeSelect.value)){       
            controlModeSelect.value = allowedTouchModes[0];
        }
        
    } else {
        // компьютер
        const delOptionTrigger = Array.from(controlModeSelect.options).find(opt => opt.value === allowedTouchModes[0])
        const delOptionMove = Array.from(controlModeSelect.options).find(opt => opt.value === allowedTouchModes[1])
        if (delOptionTrigger) controlModeSelect.remove(delOptionTrigger.index)
        if (delOptionMove) controlModeSelect.remove(delOptionMove.index)

        Array.from(controlModeSelect.options).forEach(option => {
            option.disabled = false;
        })
    }
    controlModeSelect.dispatchEvent(new Event('change'));
}

function createMobileControls(){
    if (!isTouchDevice) return;

    const mobileControls = document.createElement('div');
    mobileControls.id = 'mobile-controls'
    mobileControls.innerHTML = `
        <div class="mobile-control-btn" id="mobile-up">▼</div>
        <div class="mobile-control-btn" id="mobile-left">◄</div>
        <div class="mobile-control-btn" id="mobile-orbit">💫</div>
        <div class="mobile-control-btn" id="mobile-down">▲</div>
        <div class="mobile-control-btn" id="mobile-right">►</div>
    `;
    document.body.appendChild(mobileControls);

    document.getElementById('mobile-up').addEventListener('touchstart', () => handleMobileControl('up'));
    document.getElementById('mobile-left').addEventListener('touchstart', () => handleMobileControl('left'));
    document.getElementById('mobile-orbit').addEventListener('touchstart', (e) => {
        e.preventDefault();
        orbitMobileControl();
    })
    document.getElementById('mobile-down').addEventListener('touchstart', () => handleMobileControl('down'));
    document.getElementById('mobile-right').addEventListener('touchstart', () => handleMobileControl('right'));

    // Добавьте стили для мобильных элементов управления
    const style = document.createElement('style');
    style.textContent = `
        #mobile-controls {
            position: fixed;
            bottom: 20px;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: space-around;
            z-index: 100;
        }
        
        .control-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: rgba(52, 152, 219, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            user-select: none;
            touch-action: none;
            margin: 5px;
            transition all 0.2s;
            border: solid 1.5px transparent
        }

        #mobile-orbit {
            background-color: rgba(155, 89, 182, 0.7);          
            width: 60px;
            height: 60px;
            font-size: 30px;
        }

        #mobile-orbit.orbit-active {
            background-color: rgba(231, 76, 60, 0.9);
            border-color: white;
            box-shadow: 0 0 15px rgba(231, 76, 60, 0.7);
        }
        
        @media (max-width: 768px) {
            .control-btn {
                width: 50px;
                height: 50px;
                font-size: 16px;
            }
        }
    `;
    document.head.appendChild(style);

    updateOrbitButton()
}

function handleMobileControl(direction) {
    if (!gameState.active) return;

    switch (direction) {
        case 'up':
            rotateWholeCube(new THREE.Vector3(1, 0, 0), false);
            break;
        case 'down':
            rotateWholeCube(new THREE.Vector3(1, 0, 0), true);
            break;
        case 'left':
            rotateWholeCube(new THREE.Vector3(0, 1, 0), true);
            break;
        case 'right':
            rotateWholeCube(new THREE.Vector3(0, 1, 0), false);
            break;
        case 'rotate-x':
            rotateWholeCube(new THREE.Vector3(1, 0, 0), Math.random() > 0.5);
            break;
        case 'rotate-y':
            rotateWholeCube(new THREE.Vector3(0, 1, 0), Math.random() > 0.5);
            break;
        case 'rotate-z':
            rotateWholeCube(new THREE.Vector3(0, 0, 1), Math.random() > 0.5);
            break;
    }
}

function orbitMobileControl() {
    if (!gameState.active) return;
    
    // Переключаем состояние орбиты
    controls.enabled = !controls.enabled;
    orbitControlSet.innerText = controls.enabled ? 'вкл' : 'выкл';
    
    // Обновляем внешний вид кнопки
    updateOrbitButton();
    
    // Показываем уведомление
    showOrbitNotification(controls.enabled);
    
    // Скрываем стрелки при включении орбиты
    if (controls.enabled) {
        hideArrows();
    }
    
    console.log(`OrbitControls ${controls.enabled ? 'включены' : 'выключены'}`);
}

function updateOrbitButton() {
    const orbitBtn = document.getElementById('mobile-orbit');
    if (!orbitBtn) return;
    
    if (controls.enabled) {
        orbitBtn.textContent = '✖';
        orbitBtn.classList.add('orbit-active');
        orbitBtn.title = 'Выключить управление камерой';
    } else {
        orbitBtn.textContent = '💫';
        orbitBtn.classList.remove('orbit-active');
        orbitBtn.title = 'Включить управление камерой';
    }
}

function showOrbitNotification(isEnabled) {
    // Создаем временное уведомление
    const notification = document.createElement('div');
    notification.innerHTML = isEnabled ? 
        `Управление камерой включено 🔄 <br> Camera control is on` : 
        `Управление камерой выключено <br> Camera control is off`;
    
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-size: 16px;
        z-index: 1000;
        pointer-events: none;
        transition: opacity 0.3s;
        text-align: center;
    `;
    
    document.body.appendChild(notification);
    
    // Плавно исчезаем
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 1500);
}

function resetMouse(){
    startX = 0;
    startY = 0;
}

function tryRotate(cube, axis, isCounterclockWise){
    if (rotationInProgress) return;
    // блокировка дальнейших вызовов на время задержки
    rotationInProgress = true;

    // вызов поворота
    rotateLayer(cube, axis, isCounterclockWise);
    syncStaticCube(cube)

    // разблокировка через задержку
    setTimeout(() => {
        rotationInProgress = false;
    }, rotationDelay);
}

function syncStaticCube(dynamicCube){
    const _refDynamicObject = getReferenceDynamicObjects()
    const staticCube = _refDynamicObject.find(cube => cube.name === dynamicCube.name);
    if (!staticCube) return;

    staticCube.position.copy(dynamicCube.position);
    staticCube.quaternion.copy(dynamicCube.quaternion);
    staticCube.updateMatrixWorld(true);
}

addEventListener('contextmenu', (e) => {e.preventDefault()})

texture_grass.onError = () => {
    console.warn('Не удалось загрузить текстуру травы');
    texture_grass = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
};

const cameraInfoDiv = document.createElement('div');
cameraInfoDiv.id = 'cameraInfo';
document.body.appendChild(cameraInfoDiv);

function initThree() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    observerCamera = new THREE.PerspectiveCamera(30, width / height, 0.5, 1000);
    cameraPlayer = new THREE.PerspectiveCamera(60, width / height, 0.5, 1000);
    observerCamera.name = 'observer';
    cameraPlayer.name = 'player';

    window.addEventListener('resize', () => {
        observerCamera.aspect = width / height;
        observerCamera.updateProjectionMatrix();
        cameraPlayer.aspect = width / height;
        cameraPlayer.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    camera = observerCamera;
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 5, 0);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x86ceeb);
    scene.fog = new THREE.Fog(0x000000, 500, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    controls.target.set(0, 5, 0);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 0.2;
    controls.minDistance = 10;
    controls.maxDistance = 70;

    controlsPointer = new PointerLockControls(cameraPlayer, renderer.domElement);
    scene.add(controlsPointer.getObject());

    createMobileControls()

    controlsPointer.addEventListener('lock', () => {
        controls.enabled = false;
        camera = cameraPlayer;
        CurrentActiveCam = 'player';
        console.log('Камера: Игрок');
        updateCam();
    });

    controlsPointer.addEventListener('unlock', () => {
        controls.enabled = false;
        camera = observerCamera;
        CurrentActiveCam = 'observer';
        console.log('Камера: Наблюдатель');
        updateCam();
    });

    controls.update();

    stats = new Stats();
    document.body.appendChild(stats.dom);

    const ambientLight = new THREE.AmbientLight(0x666666);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    const distance = 20;
    directionalLight.position.set(-distance, distance, distance);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const floorGeometry = new THREE.PlaneBufferGeometry(100, 100, 1, 1);
    floorGeometry.rotateX(-Math.PI / 2);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x777777, map: texture_grass });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.translateY(-2.7);
    floor.receiveShadow = true;
    scene.add(floor);

    const helpMenu = document.getElementById('helpM');
    const mainmenu_game = document.getElementById('mainMenu_g')

    // Инициализация прогресса
    helpMenu.addEventListener('click', () => {
        const helpModal = document.getElementById('helpModal');
        updateHelpContent()
        if (helpModal) helpModal.style.display = 'block';
    });

    mainmenu_game.addEventListener('click', togglePauseMenu);
}

// функция для обновления прогресса
export function updateProgressBar(percentage){
    const progressFill = document.getElementById('progressFill');
    const progress_text = document.getElementById('progtext')
    console.log(`${percentage}%`)
    if (progressFill){
        progressFill.style.width = `${percentage}%`;       
        progress_text.style.color = '#ffff00'
        progress_text.textContent = `${Math.round(percentage)}%`       
    
        // Показываем модальное окно при достижении 100%
        if (percentage >= 100) {
            // Небольшая задержка для завершения анимации
            setTimeout(() => {
                if (congratsModal && gameState.mode === 'normal') {
                    congratsModal.style.display = 'block';
                    gameState.active = false;
                    stopTimer();
                }
            }, 300);
        }
    } else {
        console.error('Элементы прогресс-бара не найдены!');
    }
}

function createArrow(position, direction, color = 0x00ff00, isRotate = false, faceColor = 0x00ff00) {
    if (!gameState.active) return
    const geometry = isRotate ? new THREE.SphereGeometry(0.2, 16, 16) : new THREE.ConeGeometry(0.3, 0.6, 8);
    const material = new THREE.MeshBasicMaterial({ color });
    const arrow = new THREE.Mesh(geometry, material);
    arrow.position.copy(position);
    // Сохраняем цвет
    material.userData = { originalColor: color };

    if (!isRotate) {
        // Направление стрелки в мировой системе координат
        const worldDirection = direction.clone().normalize();
        arrow.lookAt(position.clone().add(worldDirection.multiplyScalar(-1)));

        const rot = rotationMap[faceColor]?.[color];
        if (rot){
            arrow.rotateX(rot[0]);
            arrow.rotateY(rot[1]);
            arrow.rotateZ(rot[2]);
        }

        // Блокируем вращение стрелки
        arrow.matrixAutoUpdate = false;
        arrow.updateMatrix();
    }

    arrow.userData = { direction };
    if (isRotate) {
        arrow.userData.isRotate = true;
        // Указываем направление вращения: по часовой (true) или против (false)
        arrow.userData.rotationDirection = color === 0x00CED1 ? false : true;
    }
    scene.add(arrow);
    return arrow;
}

function showArrows(cube, mouseCoords) {
    if (!mouseCoords){
        console.warn("showArrows: координаты не переданы, невозможно определить грань.");
        return;
    }
    const blurM = document.getElementById('blurmenu')
    if (blurM && blurM.style.display === 'block') { return; }
    // Удаляем старые стрелки
    arrows.forEach(arrow => scene.remove(arrow));
    arrows = [];

    const cubeSize = 6.12 / 3; // Размер одного кубика
    const offset = cubeSize * 0.5; // Отступ для стрелок
    const extrudeOffset = cubeSize * 0.1; // Смещение стрелок наружу
    const sphereOffset = cubeSize * 0.101; // Смещение шаров по вертикале

    // Находим грань, на которую кликнули
    const {x, y} = mouseCoords;
    const mouse = new THREE.Vector2();
    raycaster.setFromCamera(mouseCoords, camera);
    const intersects = raycaster.intersectObjects([cube], true);
    if (intersects.length === 0) return;

    const intersect = intersects[0];
    const normal = intersect.face.normal.clone().applyMatrix4(cube.matrixWorld).sub(cube.getWorldPosition(new THREE.Vector3())).normalize();

    // Позиция центра кликнутой грани
    const position = cube.getWorldPosition(new THREE.Vector3()).add(normal.clone().multiplyScalar(cubeSize * 0.5));

    // Определяем цвет грани на основе нормали
    let faceColor;
    const absNormal = new THREE.Vector3(Math.abs(normal.x), Math.abs(normal.y), Math.abs(normal.z));
    if (absNormal.x > 0.9) {
        faceColor = normal.x > 0 ? 0xff0000 : 0xffa500; // Красная или оранжевая грань
    } else if (absNormal.y > 0.9) {
        faceColor = normal.y > 0 ? 0xffffff : 0xffff00; // Белая или жёлтая грань
    } else if (absNormal.z > 0.9) {
        faceColor = normal.z > 0 ? 0x00ff00 : 0x0000ff; // Зелёная или синяя грань
    }

    // Вычисляем векторы "вверх" и "вправо" на основе нормали кликнутой грани
    let upVector = new THREE.Vector3(0, 1, 0); // Начальный "вверх"
    if (Math.abs(normal.dot(upVector)) > 0.9) {
        upVector.set(0, 0, 1); // Если нормаль близка к Y, используем Z как "вверх"
    }
    const rightVector = new THREE.Vector3().crossVectors(normal, upVector).normalize();
    upVector.crossVectors(rightVector, normal).normalize();

    // Смещение для "выдавливания" стрелок за грань
    const extrudeVector = normal.clone().multiplyScalar(extrudeOffset);

    // Определяем, является ли кликнутый кубик центральным
    const cubesObjects = getstaticObjects();
    const centerCubes = cubesObjects.filter(item => item.name.includes("CENTER"));
    const isCenterCube = centerCubes.some(center => center === cube || center.uuid === cube.uuid);

    // Стрелки для всех направлений (⬆⬇⬅➡)
    const directions = [
        { dir: rightVector.clone(), pos: upVector.clone().multiplyScalar(offset), color: 0xff0000 }, // ↑ (красный)
        { dir: rightVector.clone().negate(), pos: upVector.clone().negate().multiplyScalar(offset), color: 0x00ff00 }, // ↓ (зелёный)
        { dir: upVector.clone(), pos: rightVector.clone().negate().multiplyScalar(offset), color: 0x0000ff }, // → (синий)
        { dir: upVector.clone().negate(), pos: rightVector.clone().multiplyScalar(offset), color: 0xffff00 }, // ← (желтый)
    ];

    directions.forEach(({ dir, pos, color }) => {
        const arrowPos = position.clone().add(extrudeVector).add(pos);
        const arrow = createArrow(arrowPos, dir, color, false, faceColor);
        arrows.push(arrow);
    });

    // Добавляем шары только для центральных кубиков сторон
    if (isCenterCube) {
        const centerPos = position.clone().add(extrudeVector); // Центр грани
        // Бирюзовый шар (по часовой) чуть выше центра
        const turquoisePos = centerPos.clone().add(upVector.clone().multiplyScalar(sphereOffset + 0.025));
        const counterclockwiseSphere = createArrow(turquoisePos, normal, 0x00CED1, true); // Бирюзовый шар
        // Чёрный шар (против часовой) чуть ниже центра
        const blackPos = centerPos.clone().add(upVector.clone().negate().multiplyScalar(sphereOffset + 0.025));
        const clockwiseSphere = createArrow(blackPos, normal, 0x000001, true); // Чёрный шар 
        arrows.push(clockwiseSphere, counterclockwiseSphere);
    }   
    console.log(`Total arrows created: ${arrows.length}`);
}


function hideArrows() {
    arrows.forEach(arrow => scene.remove(arrow));
    arrows = [];
    selectedCube = null;
}

document.addEventListener('keydown', async (event) => {
    const blurM = document.getElementById('blurmenu')
    if (blurM && blurM.style.display === 'block') { return; }
    if (!gameState.active) return
    if (event.code === 'KeyO') {
        orbitMobileControl();
    } else if (event.code === 'KeyR' && CurrentActiveCam === 'observer') {
        camera.position.set(15, 15, 15);
        camera.lookAt(0, 5, 0);
        controls.update();
    } else if (event.code === 'KeyT' && CurrentActiveCam === 'observer'){
        camera.position.set(1.20, 6, 21.74);
        camera.lookAt(0, 5, 0);
        controls.update();
    } else if (event.code === 'KeyB' && CurrentActiveCam === 'observer'){
        camera.position.set(-0.31, 14.50, -21.44);
        camera.lookAt(0, 5, 0);
        controls.update();
    } else if (event.code === 'KeyI' && CurrentActiveCam === 'observer'){
        camera.position.set(-21.20, 15, -0.82);
        camera.lookAt(0, 5, 0);
        controls.update();
    } else if (event.code === 'KeyY' && CurrentActiveCam === 'observer'){
        camera.position.set(0, -18.45, 0);
        camera.lookAt(0, 5, 0);
        controls.update();
    } else if (event.code === 'KeyS' && CurrentActiveCam === 'observer'){
        alert("Начато перемешивание куба");
        scrambleCube(20);
    } else if (event.code === 'KeyC' && CurrentActiveCam === 'observer'){
        solveCube();
    } else if (event.code === 'ArrowLeft' && CurrentActiveCam === 'observer'){
        await rotateWholeCube(new THREE.Vector3(0, 1, 0), true)
    } else if (event.code === 'ArrowRight' && CurrentActiveCam === 'observer'){
        await rotateWholeCube(new THREE.Vector3(0, 1, 0), false)
    } else if (event.code === 'ArrowUp'){
        await rotateWholeCube(new THREE.Vector3(1, 0, 0), false)
    } else if (event.code === 'ArrowDown'){
        await rotateWholeCube(new THREE.Vector3(1, 0, 0), true)
    }
});

function setupTriggerInteraction(triggerZones) {
    window.addEventListener('mousedown', (event) => {
        if (!gameState.active || event.button !== 0) return;

        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);

        raycaster.setFromCamera(mouse, camera);
        const staticObjects = getstaticObjects();

        const intersects = raycaster.intersectObjects(staticObjects, true); // статический

        if (intersects.length > 0) {
            const intersect = intersects[0];
            startObject = intersect.object;
            selectedCube = startObject.parent; // Получаем группу кубика

            // Если выбран режим "Мышь", запоминаем выбранный кубик
            console.log('проверка режима: ', getControlMode())
            if (getControlMode() === 'control_mouse_move'){
                isMouseDown = true;
                rotationInProgress = false;
                selectedCubeForMouse = selectedCube;
                startX = event.clientX;
                startY = event.clientY;
                document.body.classList.add('dragging');
            } else {                                 
                showArrows(selectedCube, mouse); 
            }
            console.log('mousedown: object=', startObject.name, 'parent=', selectedCube.name);
        } else {
            hideArrows();
            console.log('mousedown: no cube hit');
        }
    });

    window.addEventListener('mousemove', (event) => {
        if (!gameState.active) return
        switch (getControlMode()){
            case 'control_arrows':
                document.body.classList.remove('dragging');
                control_arrows_mode(event);
                break;
            case 'control_mouse_move':
                if (isMouseDown) {document.body.classList.add('dragging')};
                control_mouseRotation_mode(event);
                break;
        }
    });
    
    window.addEventListener('mouseup', (event) => {
        if (!gameState.active) return
        if (!selectedCube) return;

        if (getControlMode() === 'control_arrows'){
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);

            raycaster.setFromCamera(mouse, camera);
            const arrowIntersects = raycaster.intersectObjects(arrows, true);

            if (arrowIntersects.length > 0) {
                const arrow = arrowIntersects[0].object;
                let axis = arrow.userData.direction.clone();
                const isCounterclockwise = arrow.userData.isRotate && !arrow.userData.rotationDirection
                //console.log(`Rotate TRUE/FALSE ${isCounterclockwise ? 'ПРОТИВ' : 'ПО'}, axis=`, axis.toArray());           
                rotateLayer(selectedCube, axis, isCounterclockwise);
            }

            hideArrows();
            console.log('mouseup: arrows cleared');
        } else {
            isMouseDown = false;
            rotationInProgress = false;
            selectedCubeForMouse = null;
            document.body.classList.remove('dragging')
            hideArrows();
        }
    });

    window.addEventListener('touchstart', (event) => {
        if (!gameState.active) return;

        const touchLen = event.touches.length;

        // Жест тремя пальцами - переключает орбиту
        if (touchLen === 3) {          

            // Только если не в процессе других действий

            // Переключаем орбиту
            controls.enabled = !controls.enabled;
            orbitControlSet.innerText = controls.enabled ? 'вкл' : 'выкл';

            // Обновляем кнопку
            updateOrbitButton();

            // Показываем уведомление
            showOrbitNotification(controls.enabled);

            // Скрываем стрелки при включении
            if (controls.enabled) {
                hideArrows();
            }

            // Блокируем другие жесты на короткое время
            isOrbiting = true;
            setTimeout(() => {
                isOrbiting = false;
            }, 500);

            console.log(`Жест 3 пальцев: OrbitControls ${controls.enabled ? 'включены' : 'выключены'}`);
            return;

        }
        
        // Автоматическое включение орбиты при 2+ пальцах (опционально)
        if (isTouchDevice && touchLen >= 2 && !controls.enabled) {
            console.log('автовкл орбиты при 2+ пальцах');
            controls.enabled = true;
            orbitControlSet.innerText = 'вкл';
            updateOrbitButton();
            showOrbitNotification(true);
            hideArrows();
        }

        if (touchLen === 1) {
            const touch = event.touches[0];
            const mouseCoords = new THREE.Vector2(
                (touch.clientX / window.innerWidth) * 2 - 1,
                -((touch.clientY / window.innerHeight) * 2 - 1))

            raycaster.setFromCamera(mouseCoords, camera);
            const staticObjects = getstaticObjects();

            const intersects = raycaster.intersectObjects(staticObjects, true);

            if (intersects.length > 0) {
                const intersect = intersects[0];
                startObject = intersect.object;
                selectedCube = startObject.parent;

                if (getControlMode() === 'control_touch_trigger') {
                    showArrows(selectedCube, mouseCoords);
                } else if (getControlMode() === 'control_touch_move') {
                    isMouseDown = true;
                    rotationInProgress = false;
                    selectedCubeForMouse = selectedCube;
                    startX = touch.clientX;
                    startY = touch.clientY;
                    console.log(document.body)
                    document.body.classList.add('dragging');
                    hideArrows();
                }
            } else {
                hideArrows();
            }

            currentTouches = Array.from(event.touches);

        } else if (touchLen === 2 && controls.enabled) {
            // Логика zoom
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            initialPinchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            isPinching = true;
            isOrbiting = false;
            isMouseDown = false;
            hideArrows();
            console.log('начат зум (два пальца)');
        }
    });

    window.addEventListener('touchmove', (event) => {
        if (!gameState.active) return;

        const touchLen = event.touches.length;

        // обработка вращения орбиты (3 пальца)
        if (isOrbiting && touchLen === 3) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const currentOrbitCenter = new THREE.Vector2(
                (touch1.clientX + touch2.clientX) / 2,
                (touch1.clientY + touch2.clientY) / 2
            );

            // Рассчитываем сдвиг центра и изменение угла
            const deltaX = currentOrbitCenter.x - initialOrbitCenter.x;
            const deltaY = currentOrbitCenter.y - initialOrbitCenter.y;

            // Масштабируем сдвиг для чувствительности (подобно mouse-drag)
            const sensitivity = 0.005; // Подбирается экспериментально
            const deltaPhi = -deltaX * sensitivity; // Вращение вокруг Y (лево/право)
            const deltaTheta = -deltaY * sensitivity; // Вращение вокруг X (вверх/вниз)

            controls.rotateLeft(deltaPhi);
            controls.rotateUp(deltaTheta);
            controls.update();

            initialOrbitCenter.copy(currentOrbitCenter);
        }

        if (isPinching && touchLen === 2 && controls.enabled) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const currentPinchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            const scalaDelta = currentPinchDistance / initialPinchDistance;

            // Применяем зум через OrbitControls
            // controls.dolly(scaleDelta); // Увеличивает/уменьшает приближение
            // controls.update(); // Обновляем камеру после зума

            // Или, более грубый способ (меняет FOV):
            // camera.fov /= scaleDelta; // Уменьшаем fov -> приближение
            // camera.fov = Math.max(controls.minPolarAngle, Math.min(controls.maxPolarAngle, camera.fov)); // Ограничиваем fov
            // camera.updateProjectionMatrix();

            // Лучше использовать dolly
            controls.dolly(scalaDelta);
            controls.update();

            // Обновляем initialPinchDistance для следующего шага
            initialPinchDistance = currentPinchDistance;
            return; // Не обрабатываем другие жесты одновременно
        }

        if (!isPinching && !isOrbiting && touchLen >= 1) {

            const touch = event.touches[0];
            const mouse = new THREE.Vector2();
            mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -((touch.clientY / window.innerHeight) * 2 - 1);

            if (getControlMode() === 'control_touch_trigger') {
                control_arrows_mode({ clientX: touch.clientX, clientY: touch.clientY });
            } else if (getControlMode() === 'control_touch_move' && isMouseDown) {
                control_mouseRotation_mode({ clientX: touch.clientX, clientY: touch.clientY });
                hideArrows()
            }

            currentTouches = Array.from(event.touches);
        }
    });

    window.addEventListener('touchend', (event) => {
        if (!gameState.active) return;

        // Если был жест 3 пальцев
        if (isOrbiting && event.touches.length < 3) {
            isOrbiting = false;
        }

        if ((!isPinching && !isOrbiting && getControlMode() === 'control_touch_trigger') && selectedCube) {
            const touch = event.changedTouches[0];
            const mouse = new THREE.Vector2();
            mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -((touch.clientY / window.innerHeight) * 2 - 1);

            raycaster.setFromCamera(mouse, camera);
            const arrowIntersects = raycaster.intersectObjects(arrows, true);

            if (arrowIntersects.length > 0) {
                const arrow = arrowIntersects[0].object;
                let axis = arrow.userData.direction.clone();
                const isCounterclockwise = arrow.userData.isRotate && !arrow.userData.rotationDirection;
                rotateLayer(selectedCube, axis, isCounterclockwise);
            }

            hideArrows();
        } else if (!isPinching && !isOrbiting && getControlMode() === 'control_touch_move') {
            isMouseDown = false;
            rotationInProgress = false;
            selectedCubeForMouse = null;
            document.body.classList.remove('dragging');
            hideArrows();
        }
        currentTouches = Array.from(event.touches);
    });
}

function control_arrows_mode(event) {
    if (!isDragging && selectedCube) {                           
        
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);

        raycaster.setFromCamera(mouse, camera);
        const arrowIntersects = raycaster.intersectObjects(arrows, true);

        // Сбрасываем цвет всех стрелок до оригинального
        arrows.forEach(arrow => {
            const originalColor = arrow.material.userData.originalColor || arrow.material.color.getHex();
            arrow.material.color.set(originalColor);
        });

        // Устанавливаем подсветку только для пересечённой стрелки
        if (arrowIntersects.length > 0) {
            const arrow = arrowIntersects[0].object;
            arrow.material.color.set(0xff00ff); // Подсветка при наведении
        } 
    }
}

function control_mouseRotation_mode(event) {
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    const sensitivity = MOUSE_CONTROL_SENSITIVITY;

    if (!selectedCubeForMouse || !isMouseDown || rotationInProgress) return;

    // получаем новое пересечение
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(getReferenceDynamicObjects(), true);

    if (intersects.length === 0) return;
    const intersect = intersects[0];
    const staticCube = intersect.object.parent;
    
    const normal = intersect.face.normal.clone().applyQuaternion(staticCube.quaternion);
    if (!normal) return;

    // Определяем оси вращения относительно нормали
    let upVector = new THREE.Vector3(0, 1, 0);
    if (Math.abs(normal.dot(upVector)) > 0.9) {
        upVector.set(0, 0, 1); // если нормаль почти вертикальна
    }

    const rightVector = new THREE.Vector3().crossVectors(normal, upVector).normalize();
    upVector.crossVectors(rightVector, normal).normalize();

    // Выбираем ось вращения
    let axis, isCounterclockWise;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > sensitivity) {
        axis = upVector.clone();
        isCounterclockWise = deltaX < 0;
    } else if (Math.abs(deltaY) > sensitivity) {
        axis = rightVector.clone();
        isCounterclockWise = deltaY > 0;
    } else {
        return; // выходим, если движение слишком маленькое
    }

    tryRotate(selectedCubeForMouse, axis, isCounterclockWise);
    resetMouse();
}

export function getCurrentCam() {
    return camera;
}

export function getControlMode() {
    return document.getElementById('theme-select_2')?.value || 'control_arrows';
}

function startworld() {
    requestAnimationFrame(startworld);

    try {
        bodies.forEach(({ mesh, body }) => {
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
        });

        if (controls.enabled){
            controls.update();
        }

        const pos = camera.position;
        const rot = camera.rotation;
        const rotDeg = {
            x: (rot.x * 180 / Math.PI).toFixed(2),
            y: (rot.y * 180 / Math.PI).toFixed(2),
            z: (rot.z * 180 / Math.PI).toFixed(2)
        };
        cameraInfoDiv.innerHTML = `
            Camera: ${CurrentActiveCam}<br>
            `;
            // Position: [${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}]<br>
            // Rotation: [${rotDeg.x}, ${rotDeg.y}, ${rotDeg.z}]°

        renderer.render(scene, camera);
        stats.update();
    } catch (err) {
        console.error('Ошибка в игровом цикле: ', err);
    }
}

function initializeControlMode() {
    updateControlModeSelector();
}


window.addEventListener('load', () => {
    initThree();
    initCube(scene, world, () => {
        console.log('Cube loaded, Objects length=', getObjects().length);
        const triggerZones = createTriggerZones(6.12);
        triggerZones.forEach(zone => scene.add(zone));
        setupTriggerInteraction(triggerZones);
        initPlayer(scene, renderer, controls, controlsPointer);
        initializeControlMode();
        startworld();
    });   
});