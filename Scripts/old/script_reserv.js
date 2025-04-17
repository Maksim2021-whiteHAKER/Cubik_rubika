import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js'
import Stats from 'https://unpkg.com/three@0.122.0/examples/jsm/libs/stats.module.js'
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js'
import { OrbitControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.122.0/examples/jsm/loaders/GLTFLoader.js'

let controls, camera, renderer, stats, scene, world;
let Planegeometry, Planematerial, PlaneCube;

//animate selected object
let selectedface = null
let selectedObject = null
let flash_speed = 2 // скорость мигания
let emissiveMin = 0 // минимальная интенсивность
let emissiveMax = 1 // максимальная инт.
let flash_on = false // флаг мерцания


const loaderGLTF = new GLTFLoader();
const bodies = []; // массив для физических тел
const objects = [] // двумерный массив
const Objects = [] // одномерный массив с объектами

let raycaster = new THREE.Raycaster();

let rotationGroup = []

let mouse = new THREE.Vector2();

let textureLoader = new THREE.TextureLoader();
let texture_grass = textureLoader.load("https://threejs.org/examples/textures/terrain/grasslight-big.jpg");


initThree();
initCannon();
startworld();

function initThree() {
    // Camera
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.5, 1000);
    camera.position.set(0, 30, 50);
    camera.lookAt(0, 0, 0);

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x86ceeb);
    scene.fog = new THREE.Fog(0x000000, 500, 1000);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);

    // OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 0.2;
    controls.minDistance = 10;
    controls.maxDistance = 500;

    // mouse_control
    controls.mouseButtons = {
        RIGHT: THREE.MOUSE.ROTATE
    };

    camera.rotation.set(-0.40, 0, 0);

    // Stats
    stats = new Stats();
    document.body.appendChild(stats.dom);

    // Light
    const ambientLight = new THREE.AmbientLight(0x666666);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    const distance = 20;
    directionalLight.position.set(-distance, distance, distance);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Floor
    const floorGeometry = new THREE.PlaneBufferGeometry(100, 100, 1, 1);
    floorGeometry.rotateX(-Math.PI / 2);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x777777, map: texture_grass });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.translateY(-2.7);
    floor.receiveShadow = true;
    scene.add(floor);

    // PlaneCube example
    Planegeometry = new THREE.CubeGeometry(13, 13, 13);
    Planematerial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    PlaneCube = new THREE.Mesh(Planegeometry, Planematerial);
    PlaneCube.translateY(5)
    scene.add(PlaneCube);

    // Loading GLTF model and adding to world
    loaderGLTF.load("models/Cubik-Rubik_LITE_without_camera.glb", function (gltf) {
        const model = gltf.scene;
        model.scale.set(1, 1, 1); // задаем масштаб модели
        scene.add(model);
        objects.push(model.children)

        for (const object of objects.flat()) {
            Objects.push(object)
        }

        // Создаём физическое тело для модели
        const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)); // примитив коробки, который можно настроить
        const body = new CANNON.Body({
            mass: 1,  // масса тела
            position: new CANNON.Vec3(0, 5, 0), // начальная позиция
            shape: shape,
        });

        world.addBody(body);
        bodies.push({ mesh: model, body: body });

        window.addEventListener('click', OnClickMouse, false)
    });
}

function initCannon() {
    // Создание физического мира
    world = new CANNON.World();
    //world.gravity.set(0, -9.82, 0); // Гравитация
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;

    // Создание физического тела для пола
    const groundBody = new CANNON.Body({
        mass: 0, // Пол неподвижен
        position: new CANNON.Vec3(0, 0, 0),
        shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Повернуть плоскость
    world.addBody(groundBody);
}

function OnClickMouse(event) {
    // Преобразуем координаты мыши в систему отсчета WebGL
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);

    // Устанавливаем луч от камеры через координаты мыши
    raycaster.setFromCamera(mouse, camera);

    // Находим пересечения луча с объектами
    const intersect = raycaster.intersectObjects(Objects, true);

    // Проверяем, есть ли пересечения
    if (intersect.length > 0) {
        // intersect[0] содержит информацию о первом пересечении
        const intersectObject = intersect[0].object; // Объект, с которым произошло пересечение

        if (selectedObject) {
            selectedObject.material.emissive.setHex(0x000000)
            flash_on = false
            selectedObject.material.emissiveIntensity = 0; // Сбрасываем эмиссию
        }

        // выбранный объект = нажатому объекту
        selectedObject = intersectObject

        // изменение цвета нажатого объекта
        selectedObject.material.emissive.setHex(0x0f00ff)
        flash_on = true
        flashobject()

        // Проверяем, существует ли свойство face
        if (intersect[0].face) {
            selectedface = intersect[0].face; // Грань объекта
        } else {console.log("Пересечённый объект не имеет свойства 'face'");}
    } else {console.log("Пересечений не найдено");}
}


function flashobject() {
    if (selectedObject && selectedObject.material && selectedObject.material.emissive) {
        const time = performance.now() * 0.001;
        const emissiveIntensity = emissiveMin + (Math.sin(time * flash_speed) + 1) / 2 * (emissiveMax - emissiveMin);

        // Изменяем интенсивность эмиссии
        selectedObject.material.emissiveIntensity = emissiveIntensity;

        // Повторный вызов для создания мигающего эффекта
        if (flash_on) {
            requestAnimationFrame(flashobject);
        }
    }
}

function startworld() {
    // Рендер сцены
    requestAnimationFrame(startworld);

    // Обновляем физический мир
    world.step(1 / 60);

    // Синхронизируем позиции моделей с физическими телами
    bodies.forEach(({ mesh, body }) => {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
    });

    renderer.render(scene, camera);
    stats.update();
}
