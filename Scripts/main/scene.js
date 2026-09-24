// Scripts/main/scene.js
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from '../lib/OrbitControls.js';
import { PointerLockControls } from '../lib/PointerLockControls.js';
import { three, app } from '../state.js';
import { createMobileControls } from './mobileControls.js';
import { togglePauseMenu } from '../menu/game.js'; 
import { updateHelpContent } from '../menu/help.js';
import { cLog } from "../utils/logger.js";

export let isDev = import.meta.env.DEV
const lightControls = document.getElementById('lightControls');

export let stats;
let ambientLight;
let directionalLight;

export function initThree(textureGrass) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    three.observerCamera = new THREE.PerspectiveCamera(30, width / height, 0.5, 1000);
    three.cameraPlayer = new THREE.PerspectiveCamera(60, width / height, 0.5, 1000);
    three.observerCamera.name = 'observer';
    three.cameraPlayer.name = 'player';

    three.camera = three.observerCamera;
    three.camera.position.set(15, 15, 15);
    three.camera.lookAt(0, 5, 0);

    three.scene = new THREE.Scene();
    three.scene.background = new THREE.Color(0x86ceeb);
    three.scene.fog = new THREE.Fog(0x000000, 500, 1000);
    three.renderer = new THREE.WebGLRenderer({ antialias: true });
    three.renderer.setSize(window.innerWidth, window.innerHeight);
    three.renderer.setClearColor(three.scene.fog.color);
    three.renderer.outputColorSpace = THREE.SRGBColorSpace;
    three.renderer.shadowMap.enabled = true;
    three.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(three.renderer.domElement);

    three.controls = new OrbitControls(three.camera, three.renderer.domElement);
    three.controls.enabled = false;
    three.controls.target.set(0, 5, 0);
    three.controls.rotateSpeed = 1.0;
    three.controls.zoomSpeed = 1.2;
    three.controls.enableDamping = true;
    three.controls.enablePan = false;
    three.controls.dampingFactor = 0.2;
    three.controls.minDistance = 10;
    three.controls.maxDistance = 70;

    three.controlsPointer = new PointerLockControls(three.cameraPlayer, three.renderer.domElement);
    three.scene.add(three.controlsPointer.getObject());

    createMobileControls()

    three.controlsPointer.addEventListener('lock', () => {
        three.camera = three.cameraPlayer;
        app.CurrentActiveCam = 'player';
        cLog('Камера: Игрок');
    });

    three.controlsPointer.addEventListener('unlock', () => {
        three.camera = three.observerCamera;
        app.CurrentActiveCam = 'observer';
        cLog('Камера: Наблюдатель');
    });

    three.controls.update();

    // --- Освещение ---
    isDev ? lightControls.style.display = 'block' : lightControls.style.display = 'none';
    ambientLight = new THREE.AmbientLight(0x666666, 6);
    three.scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    const distance = 20;
    directionalLight.position.set(-distance, distance, distance);
    directionalLight.castShadow = true;
    three.scene.add(directionalLight);

    if (isDev) {
        stats = new Stats();
        document.body.appendChild(stats.dom);
    
        // --- Ползунки ---
        const ambientRange = document.getElementById('ambientRange');
        const directionalRange = document.getElementById('directionalRange');
        const ambientValueLabel = document.getElementById('ambientValue');
        const directionalValueLabel = document.getElementById('directionalValue');
        const speedNumber = document.getElementById('speedNumber')
        const speedRotateControls = document.getElementById("speedRotateControls")
    
        if (ambientRange) {
            ambientRange.addEventListener('input', (e) => {
                const value = Number(e.target.value);
                ambientLight.intensity = value;
                if (ambientValueLabel) ambientValueLabel.textContent = value.toFixed(2);
            });
        }
    
        if (directionalRange) {
            directionalRange.addEventListener('input', (e) => {
                const value = Number(e.target.value);
                directionalLight.intensity = value;
                if (directionalValueLabel) directionalValueLabel.textContent = value.toFixed(2);
            });
        }

        if (speedNumber) {
            speedRotateControls.style.display = "block";
            speedNumber.addEventListener('input', (e) => {
                const value = Number(e.target.value);
                app.speedSet = value;
            })
        }
    }

    const floorGeometry = new THREE.PlaneGeometry(100, 100, 25, 25);
    floorGeometry.rotateX(-Math.PI / 2);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x777777, map: textureGrass });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.translateY(-2.7);
    floor.receiveShadow = true;
    three.scene.add(floor);

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

export function onWindowResize() { // <-- Отдельная функция
    if (!three.observerCamera || !three.cameraPlayer || !three.renderer) return;
    // --- ИСПОЛЬЗУЕМ ТЕКУЩИЕ РАЗМЕРЫ ОКНА ---
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    // --- КОНЕЦ ---

    three.observerCamera.aspect = newWidth / newHeight;
    three.observerCamera.updateProjectionMatrix();
    three.cameraPlayer.aspect = newWidth / newHeight;
    three.cameraPlayer.updateProjectionMatrix();
    three.renderer.setSize(newWidth, newHeight);

    // Опционально: обновить OrbitControls, если камера изменилась
    // three.controls.update(); // Обычно не требуется при изменении размера, но можно вызвать
}