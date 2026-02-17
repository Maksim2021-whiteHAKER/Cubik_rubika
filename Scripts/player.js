import * as THREE from '../Scripts/lib/three.module.js';
import DRACOLoader from './lib/DRACOLoader.js';
import { GLTFLoader } from './lib/GLTFLoader.js';
import { cameraPlayer } from './index.js';
import { checkFpsHit } from './cube.js';

let playerModel = null;
let playerSpeed = 0.35;
let currentCam;
let controlsPointerRef;
let orbitControlsRef;
let rendererRef
let zoomEnable = false;
let arrayKeys = ['F12']
let mouse = new THREE.Vector2();

let fpsCursor ;
let isCursorVisible = true;

export function initPlayer(sceneArg, renderer, orbitControls, controlsPointer) {
    controlsPointerRef = controlsPointer;
    orbitControlsRef = orbitControls;
    rendererRef = renderer;

    fpsCursor = document.createElement('div');
    fpsCursor.id = 'fps-cursor';
    document.body.appendChild(fpsCursor);

    const GLTFLoader_mod = new GLTFLoader();
    const DRACOLoader_mod = new DRACOLoader();

    DRACOLoader_mod.setDecoderPath('../Scripts/lib');
    GLTFLoader_mod.setDRACOLoader(DRACOLoader_mod);

    GLTFLoader_mod.load("/models/player_texture.glb", function (gltf) {
        playerModel = gltf.scene;
        playerModel.scale.set(1, 1, 1);
        playerModel.position.set(-1, -1.5, -13);
        playerModel.rotateY(Math.PI);
        sceneArg.add(playerModel);
              
        cameraPlayer.position.set(0, 0.8, 0);
        cameraPlayer.lookAt(new THREE.Vector3(0, 0.8, 0));
        cameraPlayer.rotation.order = 'YXZ';
        playerModel.add(cameraPlayer);
        

        // Проверяем наличие orbitControls перед использованием
        if (!orbitControlsRef) {
            console.error("OrbitControls not initialized!");
            return;
        }

        setupCameraControl(cameraPlayer, controlsPointerRef);
        window.addEventListener('keydown', handlePlayerMovement);
        updateCursor();
    }, undefined, function (error){
        console.error('Ошибка загрузки модели игрока: ', error);
    });
}

function setupCameraControl(cameraPlayer, controlsPointer) {
    controlsPointer.addEventListener('lock', () => {
        if (orbitControlsRef) orbitControlsRef.enabled = false;
        zoomEnable = true;
        currentCam = cameraPlayer;
        fpsCursor.style.display = 'block'
        document.getElementById('selected-cursor').style.display = 'none'
    });

    controlsPointer.addEventListener('unlock', () => {
        if (orbitControlsRef) orbitControlsRef.enabled = true;
        zoomEnable = false;
        currentCam = orbitControlsRef.object; // Используем камеру OrbitControls
        fpsCursor.style.display = 'none'
    });

    // Устанавливаем начальную камеру
    currentCam = orbitControlsRef ? orbitControlsRef.object : cameraPlayer;
}

function handlePlayerMovement(event) {
    // if (event.code !== arrayKeys[0]) {console.log('HandPlaMov: '+ event.code)}
    if (!controlsPointerRef) return;
    
    switch (event.code) {
        case 'KeyW':
            controlsPointerRef.moveForward(playerSpeed);
            break;
        case 'KeyS':
            controlsPointerRef.moveForward(-playerSpeed);
            break;
        case 'KeyD':
            controlsPointerRef.moveRight(playerSpeed);
            break;
        case 'KeyA':
            controlsPointerRef.moveRight(-playerSpeed);
            break;
        // case 'KeyF':
        //     toggleCam();
        //     break;
    }
}

function toggleCam() {
    if (!controlsPointerRef || !orbitControlsRef) return;
    
    if (document.pointerLockElement === rendererRef.domElement) {
        controlsPointerRef.unlock();
        document.getElementById('menu_settings').style.display = 'none'
    } else {
        controlsPointerRef.lock();
        document.getElementById('menu_settings').style.display = 'block'
    }
}

function zoomWheel(event){
    if (!zoomEnable) return;
    const delta = event.deltaY * 0.1; // наименьший множитель для плавности
    currentCam.fov = THREE.MathUtils.clamp(currentCam.fov + delta,
        30, // мин
        75, // макс   
    );
    document.getElementById("CurntCamFOV").innerHTML = currentCam.fov;
    currentCam.updateProjectionMatrix();
}

window.addEventListener('wheel', zoomWheel, {passive: false})


function updateCam(){
    if (!controlsPointerRef) return;

    if (fpsCursor && isCursorVisible){
        fpsCursor.style.left = `${mouse.x * 0.5 * window.innerWidth + window.innerWidth/2}px`;
        fpsCursor.style.top = `${-mouse.y * 0.5 * window.innerHeight + window.innerHeight/2}px`;
    }5

    currentCam = (document.pointerLockElement === rendererRef.domElement)
    ? cameraPlayer : orbitControlsRef.object
     
    requestAnimationFrame(updateCam)
}

function updateCursor(){
    //console.log('UC: '+!fpsCursor)
    if (!fpsCursor) return null;

    const hit = checkFpsHit()
    if (hit)
    { /*цвет попадания*/ fpsCursor.classList.add('highlight');} 
    else 
    { /*Обычный цвет*/ fpsCursor.classList.remove('highlight'); }
    requestAnimationFrame(updateCursor);
}

updateCam();