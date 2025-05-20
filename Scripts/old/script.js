import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import Stats from 'https://unpkg.com/three@0.122.0/examples/jsm/libs/stats.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import { OrbitControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.122.0/examples/jsm/loaders/GLTFLoader.js';

let controls, controlsPointer, camera, renderer, stats, scene, world;
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
let observerCamera = new THREE.PerspectiveCamera(30, window.innerWidth/window.innerHeight, 0.5, 1000);
let scale = 1
let MouseXplayer = 0
let MouseYplayer = 0
let cameraPlayer = new THREE.PerspectiveCamera(30, window.innerWidth/window.innerHeight, 0.5, 1000);
let playerModel; // Модель игрока
let playerSpeed = 0.35; // Скорость движения игрока
let playerDirection = new THREE.Vector3(); // Направление движения
const keys = {}; // Состояние клавиш

initThree();
initCannon();
startworld();

function initThree() {

    // Камера
    camera = observerCamera;

    camera.position.set(0, 30, 50);
    camera.lookAt(0, 0, 0);

    cameraPlayer.position.set(0, 1.6, 0)
    cameraPlayer.lookAt(playerDirection(0, 1.6, 0))
    cameraPlayer.rotation.order = 'YXZ'

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
    controls.target.set(0,5,0);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 0.2;
    controls.minDistance = 10;
    controls.maxDistance = 500;
    camera.rotation.set(-0.40, 0, 0);

    // захват точки(курсора)
    controlsPointer = new PointerLockControls(cameraPlayer, renderer.domElement)
    scene.add(controlsPointer.getObject())
    

    controlsPointer.addEventListener('lock', ()=>{
        controls.enabled = false;
        camera = cameraPlayer;
    })

    controlsPointer.addEventListener('unlock', ()=>{
        controls.enabled = true;
        camera = observerCamera;
    })

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
        playerLoader.load("/models/player_texture.glb", function (gltf) {
            playerModel = gltf.scene;
            playerModel.scale.set(1,1,1); // Уменьшаем масштаб модели
            playerModel.position.set(10, -1.5, 0); // Позиция игрока
            playerModel.rotateY(1.489)
            scene.add(playerModel);
            controlsPointer.getObject().position.set(0,1,0);
            playerModel.add(controlsPointer.getObject());
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

function rotateLayer(object, normal) {
    const layerData = getCubesInLayer(normal, object);
    cubesToRotate = layerData.cubes;
    rotationGroup = layerData.group;
    selectedNormal = normal;
    isDragging = true;
}

function getCubesInLayer(normal, clickedObject) {
    const layerCubes = [];
    const threshold = 0.9;
    const cubesize = 1;

    if (Math.abs(normal.x) > threshold) {
        const xLayer = Math.round(clickedObject.position.x / cubesize);
        Objects.forEach(cube => {
            if (Math.round(cube.position.x / cubesize) === xLayer) {
                layerCubes.push(cube);
            }
        });
    } else if (Math.abs(normal.y) > threshold) {
        const yLayer = Math.round(clickedObject.position.y / cubesize);
        Objects.forEach(cube => {
            if (Math.round(cube.position.y / cubesize) === yLayer) {
                layerCubes.push(cube);
            }
        });
    } else if (Math.abs(normal.z) > threshold) {
        const zLayer = Math.round(clickedObject.position.z / cubesize);
        Objects.forEach(cube => {
            if (Math.round(cube.position.z / cubesize) === zLayer) {
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
            rotateLayer();
        }
    }
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
    if (camera === cameraPlayer){
        //cameraPlayer.position.y = 1
        //cameraPlayer.position.z = 2
        cameraPlayer.position.order = 'YXZ'

        MouseXplayer = -(event.clientX / renderer.domElement.clientWidth) * 2 + 1
        MouseYplayer = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1

        cameraPlayer.rotation.x = MouseXplayer / scale;
        cameraPlayer.rotation.y = MouseYplayer / scale;    
    }


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

function toggleCam(){
    if (camera === observerCamera){
        controlsPointer.lock();
        document.body.style.cursor = 'default';

    } else {
        controlsPointer.unlock();
        document.body.style.cursor = 'default';

    }
}

window.addEventListener('wheel', (event) => {
    if (camera === cameraPlayer) { // Проверка активной камеры
        const delta = event.deltaY * 0.25; // Дельта изменения
        cameraPlayer.fov = Math.max(1, Math.min(70, cameraPlayer.fov + delta));
        cameraPlayer.updateProjectionMatrix(); // Обновляем матрицу
    }
});

window.addEventListener('keydown', (event) => {
    console.log('event: '+event.code)
    switch (event.code){
        case 'KeyF':
            toggleCam();
            break;
        case 'KeyW':
            let playerPosW = controlsPointer.moveForward(playerSpeed);           
            break;
        case 'KeyS':
            let playerPosS = controlsPointer.moveForward(-playerSpeed)
            break;
        case 'KeyD':
            let playerPosD = controlsPointer.moveRight(playerSpeed);
            break;
        case 'KeyA':
            let playerPosA = controlsPointer.moveRight(-playerSpeed)
            break;
    }
})


function startworld() {
    requestAnimationFrame(startworld);
    world.step(1 / 60);

    bodies.forEach(({ mesh, body }) => {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
    });

    const deltaTime = 1 / 60;

    renderer.render(scene, camera);
    stats.update();
}