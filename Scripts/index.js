import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import Stats from 'https://unpkg.com/three@0.122.0/examples/jsm/libs/stats.module.js';
import { OrbitControls } from '../Scripts/lib/OrbitControls.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/PointerLockControls.js';
import { initCube, world, bodies, getObjects, scrambleCube, solveCube, rotateLayer, rotateWholeCube, referenceCube, getstaticObjects } from './cube.js';
import { initPlayer } from './player.js';
import { createTriggerZones } from './cubeInteraction.js';
import { gameState, congratsModal, stopTimer } from './menu.js';

export let scene, camera, controlsPointer, observerCamera, cameraPlayer, renderer, controls;
export let CurrentActiveCam = 'observer';
let stats;
let textureLoader = new THREE.TextureLoader();
let texture_grass = textureLoader.load("https://threejs.org/examples/textures/terrain/grasslight-big.jpg");
document.getElementById('menu_settings').style.display = 'none';
let isDragging = false;
let startObject = null;
const raycaster = new THREE.Raycaster();
let arrows = []; // Массив для стрелок
let selectedCube = null;
//  элемент прогресса
let progressBar, progress_text, helpMenu, mainmenu_game;

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
    controls.maxDistance = 300;

    controlsPointer = new PointerLockControls(cameraPlayer, renderer.domElement);
    scene.add(controlsPointer.getObject());

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

    // Инициализация прогресса
    helpMenu = document.createElement('button')
    helpMenu.id = 'helpM';
    helpMenu.addEventListener('click', () => {
        const helpModal = document.getElementById('helpModal');
        if (helpModal) helpModal.style.display = 'block';
    });

    mainmenu_game = document.createElement('button')
    mainmenu_game.id = 'mainMenu_g';
    mainmenu_game.addEventListener('click', () => {
        // Здесь ваша логика выхода в меню
        if (confirm("Вы действительно хотите вернуться в главное меню?")) {
            // Сброс игры, остановка таймера и показ главного меню
            stopTimer();
            congratsModal.style.display = 'none';
            mainMenu.style.display = 'flex';
        }
    });
    
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
                if (congratsModal) {
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

        // сопоставление цвета грани на повороты
        const rotationMap = {
            0xff0000: {0x00ff00: [Math.PI, 0, 0], 0xffff00: [0, 0, -Math.PI], 0x0000ff: [Math.PI, 0, 0]}, // Красная грань
            0x00ff00: {0x00ff00: [Math.PI, 0, 0], 0xffff00: [0, 0, Math.PI / 2], 0x0000ff: [0, 0, -Math.PI / 2]}, // Зеленая грань
            0xffffff: { // белая грань
                0xff0000: [Math.PI / 2, 0, -Math.PI / 2], // Красная стрелка ↑
                0x00ff00: [Math.PI / 2, 0, -Math.PI / 2], // Зеленая стрелка ↓
                0x0000ff: [-Math.PI / 2, 0, -Math.PI / 2],// Синяя   стрелка →
                0xffff00: [Math.PI / 2, 0, -Math.PI / 2], // Желтая  стрелка ←
            },
            0xffff00: { // Желтая грань
                0xff0000: [Math.PI / 2, 0, Math.PI / 2],
                0x00ff00: [Math.PI / 2, 0, Math.PI / 2],
                0x0000ff: [-Math.PI / 2, 0, Math.PI /2],
                0xffff00: [Math.PI, 0, Math.PI / 2],
            },
            0x0000ff: { // Синяя грань
                0x00ff00: [0, 0, Math.PI],
                0x0000ff: [-Math.PI / 2, 0, Math.PI / 2],
                0xffff00: [Math.PI / 2, 0, -Math.PI / 2],
            },
            0xffa500: { /* Оранжевая грань */ 0x00ff00: [Math.PI, 0, 0] }
        };

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

function showArrows(cube) {
    // Удаляем старые стрелки
    arrows.forEach(arrow => scene.remove(arrow));
    arrows = [];

    const cubeSize = 6.12 / 3; // Размер одного кубика
    const offset = cubeSize * 0.5; // Отступ для стрелок
    const extrudeOffset = cubeSize * 0.1; // Смещение стрелок наружу
    const sphereOffset = cubeSize * 0.101; // Смещение шаров по вертикале

    // Находим грань, на которую кликнули
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
    raycaster.setFromCamera(mouse, camera);
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
    let off_on;
    if (!gameState.active) return
    if (event.code === 'KeyO') {
        if (controls.enabled) {
            controls.enabled = false;
            off_on = 'выкл';
        } else {
            controls.enabled = true;
            off_on = 'вкл';
        }
        document.getElementById('OrbitConSet').innerHTML = off_on;
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
        if (!gameState.active) return;
        if (event.button !== 0) return;
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);

        raycaster.setFromCamera(mouse, camera);
        // const objects = getObjects();
        const objects = getstaticObjects();

        const intersects = raycaster.intersectObjects(objects, true); // динамич

        if (intersects.length > 0) {
            const intersect = intersects[0];
            startObject = intersect.object;
            selectedCube = startObject.parent; // Получаем группу кубика
                       
            showArrows(selectedCube); 
            console.log('mousedown: object=', startObject.name, 'parent=', selectedCube.name);
        } else {
            hideArrows();
            console.log('mousedown: no cube hit');
        }
    });

    window.addEventListener('mousemove', (event) => {
        if (!gameState.active) return
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
    });
    

    window.addEventListener('mouseup', (event) => {
        if (!gameState.active) return
        if (!selectedCube) return;

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
    });
}

export function getCurrentCam() {
    return camera;
}

function startworld() {
    requestAnimationFrame(startworld);
    try {
        bodies.forEach(({ mesh, body }) => {
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
        });

        const pos = camera.position;
        const rot = camera.rotation;
        const rotDeg = {
            x: (rot.x * 180 / Math.PI).toFixed(2),
            y: (rot.y * 180 / Math.PI).toFixed(2),
            z: (rot.z * 180 / Math.PI).toFixed(2)
        };
        cameraInfoDiv.innerHTML = `
            Camera: ${CurrentActiveCam}<br>
            Position: [${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}]<br>
            Rotation: [${rotDeg.x}, ${rotDeg.y}, ${rotDeg.z}]°
        `;

        renderer.render(scene, camera);
        stats.update();
    } catch (err) {
        console.error('Ошибка в игровом цикле: ', err);
    }
}

window.addEventListener('load', () => {
    initThree();
    initCube(scene, world, () => {
        console.log('Cube loaded, Objects length=', getObjects().length);
        const triggerZones = createTriggerZones(6.12);
        triggerZones.forEach(zone => scene.add(zone));
        setupTriggerInteraction(triggerZones);
        initPlayer(scene, renderer, controls, controlsPointer);
        startworld();
    });   
});

