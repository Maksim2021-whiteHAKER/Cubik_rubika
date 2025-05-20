import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import Stats from 'https://unpkg.com/three@0.122.0/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/PointerLockControls.js';
import { initCube, world, bodies, getObjects } from './cube.js';
import { initPlayer } from './player.js';
import { createTriggerZones } from './cubeInteraction.js';
import { rotateLayer } from './cube.js';

export let scene, camera, controlsPointer, observerCamera, cameraPlayer, renderer, controls;
export let CurrentActiveCam = 'observer';
let stats;
let textureLoader = new THREE.TextureLoader();
let texture_grass = textureLoader.load("https://threejs.org/examples/textures/terrain/grasslight-big.jpg");
document.getElementById('menu_settings').style.display = 'none';
let isDragging = false;
let startObject = null;
let startNormal = null;
let startMousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let lastHighlightedZone = null;

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
    camera.position.set(18.74, 15.09, 18.81);
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
    });

    controlsPointer.addEventListener('unlock', () => {
        controls.enabled = true;
        camera = observerCamera;
        CurrentActiveCam = 'observer';
        console.log('Камера: Наблюдатель');
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
}

document.addEventListener('keydown', (event) => {
    let off_on;
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
        camera.position.set(10, 10, 10);
        camera.lookAt(0, 5, 0);
        controls.update();
    }
});

function setupTriggerInteraction(triggerZones) {
    window.addEventListener('mousedown', (event) => {
        if (event.button !== 0) return;
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);

        raycaster.setFromCamera(mouse, camera);
        const objects = getObjects();
        const intersects = raycaster.intersectObjects(objects, true);

        console.log('mousedown: intersects=', intersects.length, 'Objects.length=', objects.length);
        if (intersects.length > 0) {
            const intersect = intersects[0];
            startObject = intersect.object;
            startMousePosition.set(event.clientX, event.clientY);
            isDragging = true;

            const localNormal = intersect.face.normal.clone();
            startNormal = localNormal.applyMatrix4(intersect.object.matrixWorld).normalize();
            console.log('mousedown: object=', startObject.name, 'normal=', startNormal.toArray());
        } else {
            console.log('mousedown: no cube hit');
        }
    });

    window.addEventListener('mousemove', (event) => {
        if (!isDragging || !startObject) return;

        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);

        // Визуализация луча для отладки
        raycaster.setFromCamera(mouse, camera);
        const rayGeometry = new THREE.BufferGeometry().setFromPoints([
            camera.position,
            camera.position.clone().add(raycaster.ray.direction.clone().multiplyScalar(50))
        ]);
        const rayMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const rayLine = new THREE.Line(rayGeometry, rayMaterial);
        scene.add(rayLine);
        setTimeout(() => scene.remove(rayLine), 100);

        // Проверяем кубики
        const cubeIntersects = raycaster.intersectObjects(getObjects(), true);

        // Сбрасываем подсветку
        if (lastHighlightedZone) {
            lastHighlightedZone.material.color.set(0x00ffff);
            lastHighlightedZone.material.opacity = 0.5;
            lastHighlightedZone = null;
        }

        if (cubeIntersects.length > 0) {
            const cubeHit = cubeIntersects[0];
            console.log('mousemove: cube hit at distance=', cubeHit.distance, 'object=', cubeHit.object.name);

            // Проверяем триггеры с увеличенным расстоянием
            raycaster.far = cubeHit.distance + 2; // Увеличиваем до 2 единиц
            const triggerIntersects = raycaster.intersectObjects(triggerZones, false);

            console.log('mousemove: trigger intersects=', triggerIntersects.length);
            if (triggerIntersects.length > 0) {
                const trigger = triggerIntersects[0].object;
                const { triggeredFace } = trigger.userData;

                trigger.material.color.set(0xffff00);
                trigger.material.opacity = 0.8;
                lastHighlightedZone = trigger;

                console.log('Trigger hit: face=', triggeredFace, 'position=', trigger.position.toArray(), 'distance=', triggerIntersects[0].distance);

                let axis;
                switch (triggeredFace) {
                    case 'right': axis = new THREE.Vector3(1, 0, 0); break;
                    case 'left': axis = new THREE.Vector3(-1, 0, 0); break;
                    case 'up': axis = new THREE.Vector3(0, 1, 0); break;
                    case 'down': axis = new THREE.Vector3(0, -1, 0); break;
                    case 'front': axis = new THREE.Vector3(0, 0, 1); break;
                    case 'back': axis = new THREE.Vector3(0, 0, -1); break;
                    default: return;
                }

                console.log('Trigger hit: face=', triggeredFace, 'axis=', axis.toArray());
                rotateLayer(startObject, axis);

                isDragging = false;
                startObject = null;
                startNormal = null;
            } else {
                console.log('mousemove: no trigger hit');
                // Логируем позиции триггеров для отладки
                triggerZones.forEach(zone => {
                    console.log(`Zone: ${zone.userData.triggeredFace}, Position: [${zone.position.x.toFixed(2)}, ${zone.position.y.toFixed(2)}, ${zone.position.z.toFixed(2)}], Distance from camera: ${camera.position.distanceTo(zone.position).toFixed(2)}`);
                });
            }
            raycaster.far = Infinity;
        } else {
            console.log('mousemove: no cube hit');
        }
    });

    window.addEventListener('mouseup', () => {
        console.log('mouseup: stopping drag');
        if (lastHighlightedZone) {
            lastHighlightedZone.material.color.set(0x00ffff);
            lastHighlightedZone.material.opacity = 0.5;
            lastHighlightedZone = null;
        }
        isDragging = false;
        startObject = null;
        startNormal = null;
    });
}

export function getCurrentCam() {
    return camera;
}

function startworld() {
    requestAnimationFrame(startworld);
    try {
        world.step(1/60);
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

        const deltaTime = 1/60;
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
