import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import Stats from 'https://unpkg.com/three@0.122.0/examples/jsm/libs/stats.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import { OrbitControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.122.0/examples/jsm/loaders/GLTFLoader.js';

let controls, camera, renderer, stats, scene, world;
let Planegeometry, Planematerial, PlaneCube;
let selectedface = null;
let selectedObject = null;
let flash_speed = 2; // скорость мигания
let emissiveMin = 0; // минимальная интенсивность
let emissiveMax = 1; // максимальная интенсивность
let flash_on = false; // флаг мерцания
const loaderGLTF = new GLTFLoader();
const bodies = []; // массив для физических тел
const objects = []; // двумерный массив
const Objects = []; // одномерный массив с объектами
let raycaster = new THREE.Raycaster();
let rotationGroup = [];
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let cubesToRotate = [];
let selectedNormal = null; // Нормаль выбранной грани для вращения
let mouse = new THREE.Vector2();
let textureLoader = new THREE.TextureLoader();
let texture_grass = textureLoader.load("https://threejs.org/examples/textures/terrain/grasslight-big.jpg");
let playerModel; // Модель игрока
let playerSpeed = 0.1; // Скорость движения игрока
let playerDirection = new THREE.Vector3(); // Направление движения
const keys = {}; // Состояние клавиш
let deltaTime; // Время между кадрами


initThree();
initCannon();
startworld();

function initThree() {
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.5, 1000);
    camera.position.set(0, 30, 50);
    camera.lookAt(0, 0, 0);

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
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 0.2;
    controls.minDistance = 10;
    controls.maxDistance = 500;
    camera.rotation.set(-0.40, 0, 0);

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

    Planegeometry = new THREE.BoxGeometry(13, 13, 13);
    Planematerial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    PlaneCube = new THREE.Mesh(Planegeometry, Planematerial);
    PlaneCube.translateY(5);
    scene.add(PlaneCube);

    loaderGLTF.load("models/Cubik-Rubik_LITE_without_camera.glb", function (gltf) {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        scene.add(model);
        objects.push(model.children);
        for (const object of objects.flat()) {
            Objects.push(object);
            rotationGroup.push(object);
        }

        const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(0, 5, 0),
            shape: shape,
        });
        world.addBody(body);
        bodies.push({ mesh: model, body: body });

        // Загружаем модель игрока
        const playerLoader = new GLTFLoader();
        playerLoader.load("models/player_0321155611_texture.glb", function (gltf) {
            playerModel = gltf.scene;
            playerModel.scale.set(1, 1, 1); // Уменьшаем масштаб модели
            playerModel.position.set(-10, -1.5, 0); // Позиция игрока
            playerModel.receiveShadow = true; // Позволяет модели получать тени
            playerModel.castShadow = true; // Позволяет модели отбрасывать тени
            scene.add(playerModel);

            console.log("Модель игрока успешно загружена!");
        }, undefined, function (error) {
            console.error("Ошибка загрузки модели игрока:", error);
        });
    });

    window.addEventListener('click', OnClickMouse, false);
}

function initCannon() {
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

function OnClickMouse(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
    raycaster.setFromCamera(mouse, camera);
    const intersect = raycaster.intersectObjects(Objects, true);

    if (intersect.length > 0) {
        const intersectObject = intersect[0].object;
        if (selectedObject) {
            selectedObject.material.emissive.setHex(0x000000);
            flash_on = false;
            selectedObject.material.emissiveIntensity = 0;
        }
        selectedObject = intersectObject;
        selectedObject.material.emissive.setHex(0x0f00ff);
        flash_on = true;
        flashobject();
        if (intersect[0].face) {
            const normal = intersect[0].face.normal;
            rotateLayer(selectedObject, normal);
        }
    }
}

function rotateLayer(object, normal) {
    const layerData = getCubesInLayer(normal, object);
    cubesToRotate = layerData.cubes;
    rotationGroup = layerData.group;
    selectedNormal = normal;
    isDragging = true;
}

function getCubesInLayer(normal, clickedObject) {
    const layerCubes = [];
    const threshold = 0.01;
    if (Math.abs(normal.x) > 0.9) {
        const xLayer = clickedObject.position.x;
        Objects.forEach(cube => {
            if (Math.abs(cube.position.x - xLayer) < threshold) {
                layerCubes.push(cube);
            }
        });
    } else if (Math.abs(normal.y) > 0.9) {
        const yLayer = clickedObject.position.y;
        Objects.forEach(cube => {
            if (Math.abs(cube.position.y - yLayer) < threshold) {
                layerCubes.push(cube);
            }
        });
    } else if (Math.abs(normal.z) > 0.9) {
        const zLayer = clickedObject.position.z;
        Objects.forEach(cube => {
            if (Math.abs(cube.position.z - zLayer) < threshold) {
                layerCubes.push(cube);
            }
        });
    }
    const layerGroup = new THREE.Group();
    layerCubes.forEach(cube => {
        layerGroup.add(cube.clone());
    });
    return { cubes: layerCubes, group: layerGroup };
}

function flashobject() {
    if (selectedObject && selectedObject.material && selectedObject.material.emissive) {
        const time = performance.now() * 0.001;
        const emissiveIntensity = emissiveMin + (Math.sin(time * flash_speed) + 1) / 2 * (emissiveMax - emissiveMin);
        selectedObject.material.emissiveIntensity = emissiveIntensity;
        if (flash_on) {
            requestAnimationFrame(flashobject);
        }
    }
}

window.addEventListener('mousemove', function(event) {
    if (isDragging && rotationGroup) {
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y,
        };
        const rotationSpeed = 0.01;
        let axis = new THREE.Vector3();
        if (Math.abs(selectedNormal.x) > 0.9) {
            axis.set(1, 0, 0);
        } else if (Math.abs(selectedNormal.y) > 0.9) {
            axis.set(0, 1, 0);
        } else if (Math.abs(selectedNormal.z) > 0.9) {
            axis.set(0, 0, 1);
        }
        rotationGroup.rotateOnAxis(axis, deltaMove.x * rotationSpeed);
    }
    previousMousePosition = { x: event.clientX, y: event.clientY };
});

window.addEventListener('mouseup', function() {
    isDragging = false;
    cubesToRotate = [];
    selectedNormal = null;
    rotationGroup = null;
});

function movePlayer() {
    if (keys['KeyW']) {
        playerDirection.set(0, 0, -1);
    } else if (keys['KeyS']) {
        playerDirection.set(0, 0, 1);
    } else if (keys['KeyA']) {
        playerDirection.set(-1, 0, 0);
    } else if (keys['KeyD']) {
        playerDirection.set(1, 0, 0);
    } else {
        playerDirection.set(0, 0, 0);
    }

    playerModel.position.addScaledVector(playerDirection, playerSpeed * deltaTime);

    // Ограничение перемещения внутри поля
    playerModel.position.x = Math.max(-15, Math.min(15, playerModel.position.x));
    playerModel.position.z = Math.max(-15, Math.min(15, playerModel.position.z));
}

// Камера наблюдателя
const observerCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
observerCamera.position.set(0, 10, 20); // Расположение камеры наблюдателя
observerCamera.lookAt(playerModel.position); // Направление камеры на персонажа

// Камера от первого лица
const firstPersonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
firstPersonCamera.position.set(0, 1.6, 0); // Позиция камеры относительно персонажа
firstPersonCamera.lookAt(new THREE.Vector3(0, 1.6, 0)); // Направление камеры

// Переключение между камерами
let currentCamera = observerCamera; // Начальная камера (камера наблюдателя)
function toggleCamera() {
    if (currentCamera === observerCamera) {
        currentCamera = firstPersonCamera;
        document.body.style.cursor = 'none'; // Скрываем курсор
    } else {
        currentCamera = observerCamera;
        document.body.style.cursor = 'default'; // Возвращаем курсор
    }
}

window.addEventListener('keydown', (event) => {
    if (event.code === 'KeyF') {
        toggleCamera();
    }
});

function startworld() {
    if (!playerModel){
        requestAnimationFrame(startworld)
        return
    }

    requestAnimationFrame(startworld);
    world.step(1 / 60);

    bodies.forEach(({ mesh, body }) => {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
    });

    deltaTime = 1 / 60;
    movePlayer();

    renderer.render(scene, camera);
    stats.update();
}