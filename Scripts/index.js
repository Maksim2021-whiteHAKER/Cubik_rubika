import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import Stats from 'https://unpkg.com/three@0.122.0/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/PointerLockControls.js';
import { initCube, world, bodies} from './cube.js';
import { initPlayer } from './player.js';

export let scene, camera, controlsPointer, observerCamera, cameraPlayer, renderer, controls
export let CurrentActiveCam = 'observer'
let stats
let Planegeometry, Planematerial, PlaneCube;
export const Objects = []; // одномерный массив с объектами
let textureLoader = new THREE.TextureLoader();
let texture_grass = textureLoader.load("https://threejs.org/examples/textures/terrain/grasslight-big.jpg");
const keys = {}; // Состояние клавиш
document.getElementById('menu_settings').style.display = 'none'

// ошибки
texture_grass.onError = () =>{
    console.warn('не удалось загрузить текстуру травы')
    texture_grass = new THREE.MeshLambertMaterial({color: 0x00aa00})
}

function initThree(){
    const width = window.innerWidth;
    const height = window.innerHeight;
    // КАМЕРА НАБЛЮДАТЕЛЯ И ИГРОКА
    observerCamera = new THREE.PerspectiveCamera(30, width / height, 0.5, 1000);
    cameraPlayer = new THREE.PerspectiveCamera(60, width / height, 0.5, 1000);

    observerCamera.name = 'observer'; // Наблюдатель
    cameraPlayer.name = 'player';     // Игрок

    window.addEventListener('resize', ()=>{
    
        observerCamera.aspect = width/height;
        observerCamera.updateProjectionMatrix();
    
        cameraPlayer.aspect = width/height;
        cameraPlayer.updateProjectionMatrix();
    
        renderer.setSize(width, height)
    })

   // Камера
    camera = observerCamera;
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
    controls.target.set(0, 5, 0);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 0.2;
    controls.minDistance = 10;
    controls.maxDistance = 300;
    camera.rotation.set(-0.40, 0, 0);

    // захват точки(курсора)
    controlsPointer = new PointerLockControls(cameraPlayer, renderer.domElement);
    scene.add(controlsPointer.getObject());

    controlsPointer.addEventListener('lock', ()=>{
        controls.enabled = false;
        camera = cameraPlayer
        CurrentActiveCam = 'player';
        console.log('Камера: Игрок');
    })

    controlsPointer.addEventListener('unlock', ()=>{
        controls.enabled = true;
        camera = observerCamera
        CurrentActiveCam = 'observer';
        console.log('Камера: Наблюдатель')
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

    Planegeometry = new THREE.BoxGeometry(10,10,10);
    Planematerial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true, transparent: true, opacity: 0 });
    PlaneCube = new THREE.Mesh(Planegeometry, Planematerial);
    PlaneCube.translateY(5);
    scene.add(PlaneCube); 
}

document.addEventListener('keydown', (event)=>{
    let off_on;
    if (event.code === 'KeyO' ){
      if (controls.enabled){
        controls.enabled = false;
        off_on = 'выключено';
      } else {controls.enabled = true; off_on = 'включено'}
      document.getElementById('OrbitConSet').innerHTML = off_on
    }  

})

export function getCurrentCam(){
    return currentCamera;
}

function startworld(){
    requestAnimationFrame(startworld);
    try {
        world.step(1/60);
        bodies.forEach(({mesh, body}) => {
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion); 
        });
        const deltaTime = 1/60
        renderer.render(scene, camera);
        stats.update();
    } catch (err) {
        console.error('Ошибка в игровом цикле: ', err)
    }
}

window.addEventListener('load', () => {
    initThree();
    initCube(scene, world);
    initPlayer(scene, renderer, controls, controlsPointer);
    startworld(world);
})