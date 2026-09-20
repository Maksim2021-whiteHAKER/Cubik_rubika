// Scripts/player.js
import * as THREE  from 'three';
import DRACOLoader from './lib/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { three, ui } from './state.js'
import { checkFpsHit } from './cube.js';

let playerModel = null;
let playerSpeed = 0.35;
let currentCam;
let controlsPointerRef;
let orbitConFullText = document.getElementById('OrbitCon');
let orbitControlsRef;
let rendererRef;
let zoomEnable = false;
const keys = { KeyW: false, KeyS: false, KeyA: false, KeyD: false };

let fpsCursor;
let isCursorVisible = true;
let orbitWasEnabledBeforeFps = false;

export function initPlayer(sceneArg, renderer, orbitControls, controlsPointer) {
    controlsPointerRef = controlsPointer;
    orbitControlsRef = orbitControls;
    rendererRef = renderer;

    fpsCursor = document.createElement('div');
    fpsCursor.id = 'fps-cursor';
    document.body.appendChild(fpsCursor);

    const GLTFLoader_mod = new GLTFLoader();
    const DRACOLoader_mod = new DRACOLoader();

    DRACOLoader_mod.setDecoderPath('draco/');
    GLTFLoader_mod.setDRACOLoader(DRACOLoader_mod);

    GLTFLoader_mod.load("models/player_texture.glb", function (gltf) {
        playerModel = gltf.scene;
        playerModel.scale.set(1, 1, 1);
        playerModel.position.set(-1, -1.5, -13);
        playerModel.rotateY(Math.PI);
        sceneArg.add(playerModel);

        three.cameraPlayer.position.set(0, 0.8, 0);
        three.cameraPlayer.rotation.order = 'YXZ';
        playerModel.add(three.cameraPlayer);

        if (!orbitControlsRef) {
            console.error("OrbitControls not initialized!");
            return;
        }

        setupCameraControl(three.cameraPlayer, controlsPointerRef);
        updateCursor();
    }, undefined, function (error) {
        console.error('Ошибка загрузки модели игрока: ', error);
    });

    // Слушатели клавиатуры — регистрируем один раз
    window.addEventListener('keydown', handlePlayerMovement);
    window.addEventListener('keyup', handlePlayerMovement);

    // Запускаем циклы один раз
    updateCam();
    applyMovement();
}

function setupCameraControl(cameraPlayer, controlsPointer) {
    controlsPointer.addEventListener('lock', () => {
        orbitWasEnabledBeforeFps = orbitControlsRef?.enabled ?? false;
        if (orbitControlsRef) orbitControlsRef.enabled = false; 
        if (orbitConFullText) orbitConFullText.style.display = 'none';
        zoomEnable = true;
        currentCam = cameraPlayer;
        if (fpsCursor) fpsCursor.style.display = 'block';
        const menuSettings = document.getElementById('menu_settings')
        if (menuSettings) menuSettings.style.display = 'block';
    });

    controlsPointer.addEventListener('unlock', () => {
        if (orbitControlsRef) orbitControlsRef.enabled = orbitWasEnabledBeforeFps;
        if (ui.orbitControlSet) ui.orbitControlSet.innerText = orbitControlsRef?.enabled ? "вкл" : "выкл"; 
        if (orbitConFullText) orbitConFullText.style.display = 'block';
        zoomEnable = false;
        currentCam = orbitControlsRef?.object ?? three.cameraPlayer;
        if (fpsCursor) fpsCursor.style.display = 'none';
        const menuSettings = document.getElementById('menu_settings')
        if (menuSettings) menuSettings.style.display = 'none';
    });

    currentCam = orbitControlsRef?.object ?? three.cameraPlayer;
}

function handlePlayerMovement(event) {
    if (!controlsPointerRef) return;
    if (event.repeat) return;

    if (event.code in keys) {
        keys[event.code] = event.type === 'keydown';
    }

    if (event.code === 'KeyF' && event.type === 'keydown') {
        toggleCam();
    }
}

function toggleCam() {
    if (!controlsPointerRef || !orbitControlsRef) return;
    if (document.pointerLockElement === rendererRef.domElement) { controlsPointerRef.unlock(); } else { controlsPointerRef.lock(); }
}

function zoomWheel(event) {
    if (!zoomEnable) return;
    const delta = event.deltaY * 0.1;
    currentCam.fov = THREE.MathUtils.clamp(currentCam.fov + delta, 30, 75);
    document.getElementById("CurntCamFOV").innerHTML = currentCam.fov;
    currentCam.updateProjectionMatrix();
}

window.addEventListener('wheel', zoomWheel, { passive: false });

function updateCam() {
    if (!controlsPointerRef) return;

    currentCam = (document.pointerLockElement === rendererRef.domElement)
        ? three.cameraPlayer
        : (orbitControlsRef?.object || three.cameraPlayer);

    if (fpsCursor && isCursorVisible) {
        fpsCursor.style.left = '50%';
        fpsCursor.style.top = '50%';
        fpsCursor.style.transform = 'translate(-50%, -50%)';
    }

    requestAnimationFrame(updateCam);
}

function applyMovement() {
    if (document.pointerLockElement === rendererRef.domElement) {
        if (keys.KeyW) controlsPointerRef.moveForward(playerSpeed);
        if (keys.KeyS) controlsPointerRef.moveForward(-playerSpeed);
        if (keys.KeyD) controlsPointerRef.moveRight(playerSpeed);
        if (keys.KeyA) controlsPointerRef.moveRight(-playerSpeed);
    }

    requestAnimationFrame(applyMovement);
}

function updateCursor() {
    if (!fpsCursor) return;

    const hit = checkFpsHit();
    if (hit) {
        fpsCursor.classList.add('highlight');
    } else {
        fpsCursor.classList.remove('highlight');
    }
    requestAnimationFrame(updateCursor);
}