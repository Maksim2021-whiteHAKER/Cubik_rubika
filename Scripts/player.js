// просто модель - без актива не игрок а так для фона
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.122.0/examples/jsm/loaders/GLTFLoader.js';
import { cameraPlayer } from './index.js';


let playerModel = null;
let controlsPointerRef;
let orbitControlsRef;
let rendererRef

export function initPlayer(sceneArg, renderer, orbitControls, controlsPointer) {
    controlsPointerRef = controlsPointer;
    orbitControlsRef = orbitControls;
    rendererRef = renderer;

    const playerLoader = new GLTFLoader();
    playerLoader.load("/models/player_texture.glb", function (gltf) {
        playerModel = gltf.scene;
        playerModel.scale.set(1, 1, 1);
        playerModel.position.set(2, -1.5, -15);
        playerModel.rotateY(Math.PI);
        sceneArg.add(playerModel);        

        // Проверяем наличие orbitControls перед использованием
        if (!orbitControlsRef) {
            console.error("OrbitControls not initialized!");
            return;
        }

        setupCameraControl(cameraPlayer, controlsPointerRef);
        window.addEventListener('keydown', handlePlayerMovement);
        updateCursor();
    }, undefined, function (error){
        console.error('Ошибка загрузки модели: ', error);
    });
}