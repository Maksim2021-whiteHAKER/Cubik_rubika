// Scripts/index.js
import * as THREE from 'three';
import { getObjects, initCube, rotateWholeCube, scrambleCube, solveCube } from './cube.js';
import { createTriggerZones } from './cubeInteraction.js';
import { setupTriggerInteraction } from './main/controls.js';
import { orbitMobileControl } from './main/mobileControls.js';
import { initThree, onWindowResize, stats } from './main/scene.js';
import { notif } from './menu/data.js';
import { initMenu } from "./menu/index.js";
import { isYandex } from './platform/detect.js';
import { initStorage } from './platform/storage.js';
import { initPlayer } from './player.js';
import { app, cube, game, three, ui } from './state.js';
import { isTouch } from './utils/device.js';
import { cLog, cWarn, isDev } from './utils/logger.js';
import { getSettings } from './platform/settingsStorage.js';

let textureLoader = new THREE.TextureLoader();
let textureGrass = textureLoader.load('textures/grasslightmin.jpg');
textureGrass.wrapS = THREE.RepeatWrapping;
textureGrass.wrapT = THREE.RepeatWrapping;
textureGrass.repeat.set(2.3, 2.3);
document.getElementById('menu_settings').style.display = 'none';
ui.orbitControlSet = document.getElementById('OrbitConSet')

// переменные для управления мышью
app.isMouseDown = false;

// получение нормали координат девайса

app.isTouchDevice = isTouch();

async function loadYandexScript() {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://yandex.ru/games/sdk/v2';
        s.onload = resolve;
        s.onerror = () => reject(new Error("SDK load failed"));
        document.head.appendChild(s);
    });
}

function updateControlModeSelector() {
    const selecter = document.getElementById('control-selecter');
    if (!selecter) { cWarn('элемент не найден'); return; }

    const s = getSettings();
    const controls = {
        touch_arrows: 'control_touch_trigger', mouse_arrows: 'control_arrows',
        touch_move:   'control_touch_move',    mouse_move:   'control_mouse_move'
    };

    selecter.innerText = '';

    if (app.isTouchDevice) {
        selecter.appendChild(new Option("Зажатие + Стрелки на кубе", controls.touch_arrows));
        selecter.appendChild(new Option("Зажатие + Движение пальцем", controls.touch_move));
    } else {
        selecter.appendChild(new Option("Зажатие + Стрелки на кубе", controls.mouse_arrows));
        selecter.appendChild(new Option("Зажатие + Движение мышью", controls.mouse_move));
    }

    // Восстанавливаем сохранённое, если валидно для текущего устройства
    const saved = s.controlMode;
    const valid = saved && selecter.querySelector(`option[value="${saved}"]`);
    if (valid) {
        selecter.value = saved;
    } else {
        // дефолт по устройству
        selecter.value = app.isTouchDevice ? controls.touch_arrows : controls.mouse_arrows;
    }

    selecter.dispatchEvent(new Event('change'));
}

addEventListener('contextmenu', (e) => {e.preventDefault()})

textureGrass.onError = () => {
    cWarn('Не удалось загрузить текстуру травы');
    textureGrass = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
};

const cameraInfoDiv = document.createElement('div');
cameraInfoDiv.id = 'cameraInfo';
cameraInfoDiv.style.display = 'none'
document.body.appendChild(cameraInfoDiv);

document.addEventListener('keydown', async (event) => {
    const blurM = document.getElementById('blurmenu')
    if (blurM && blurM.classList.contains('active')) { return; }
    if (!game.active) return
    if (app.CurrentActiveCam === 'player') return;
    if (event.code === 'KeyO') {
        orbitMobileControl();
    } else if (event.code === 'KeyR') {
        three.camera.position.set(15, 15, 15);
        three.camera.lookAt(0, 5, 0);
        three.controls.update();
    } else if (event.code === 'KeyT'){
        three.camera.position.set(1.20, 6, 21.74);
        three.camera.lookAt(0, 5, 0);
        three.controls.update();
    } else if (event.code === 'KeyB'){
        three.camera.position.set(-0.31, 14.50, -21.44);
        three.camera.lookAt(0, 5, 0);
        three.controls.update();
    } else if (event.code === 'KeyI'){
        three.camera.position.set(-21.20, 15, -0.82);
        three.camera.lookAt(0, 5, 0);
        three.controls.update();
    } else if (event.code === 'KeyY'){
        three.camera.position.set(0, -18.45, 0);
        three.camera.lookAt(0, 5, 0);
        three.controls.update();
    } else if (event.code === 'KeyS'){
        notif.info("Начато перемешивание куба", 'center', 3000);
        scrambleCube(20);
    } else if (event.code === 'KeyC'){
        solveCube();
    } else if (event.code === 'ArrowLeft' ){
        await rotateWholeCube(new THREE.Vector3(0, 1, 0), true)
    } else if (event.code === 'ArrowRight'){
        await rotateWholeCube(new THREE.Vector3(0, 1, 0), false)
    } else if (event.code === 'ArrowUp'){
        await rotateWholeCube(new THREE.Vector3(1, 0, 0), false)
    } else if (event.code === 'ArrowDown'){
        await rotateWholeCube(new THREE.Vector3(1, 0, 0), true)
    }
});

window.addEventListener('resize', (event) => {
    cLog('Размер окна или ориентация изменились (resize)!');

    // Ваша функция обновления Three.js
    onWindowResize(); // Или тот код, что вы используете для resize
});

function startworld() {
    requestAnimationFrame(startworld);

    try {
        cube.bodies.forEach(({ mesh, body }) => {
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
        });

        if (three.controls.enabled){
            three.controls.update();
        }

        if (isDev) {
            cameraInfoDiv.style.display = 'block';
            const pos = three.camera.position;
            const rot = three.camera.rotation;
            const rotDeg = {
                x: (rot.x * 180 / Math.PI).toFixed(2),
                y: (rot.y * 180 / Math.PI).toFixed(2),
                z: (rot.z * 180 / Math.PI).toFixed(2)
            };
            cameraInfoDiv.innerHTML = `
                Camera: ${app.CurrentActiveCam}<br>
                Position: [${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}]<br>
                Rotation: [${rotDeg.x}, ${rotDeg.y}, ${rotDeg.z}]°
            `;
            stats.update();
        }

        three.renderer.render(three.scene, three.camera);
    } catch (err) {
        console.error('Ошибка в игровом цикле: ', err);
    }
}

function initializeControlMode() {
    updateControlModeSelector();
}

game.selector_theme = document.getElementById('theme-select');
ui.congratsModal = document.getElementById('congratsModal');

window.addEventListener('load', async () => {
    // 1. Yandex SDK (если применимо)
    let ysdk = null;
    if (isYandex()) {
        try {
            await loadYandexScript();
            ysdk = await window.YaGames.init();
            ysdk.features.LoadingAPI?.ready();
        } catch (e) {
            console.error('[bootstrap] YaGames init failed', e);
        }
    }

    // 2. Синхронизация облака → localStorage (до texturing!)
    await initStorage(ysdk);

    initThree(textureGrass);
    initCube(three.scene, cube.world, () => {
        initMenu();
        cLog('Cube loaded, Objects length=', getObjects().length);
        const triggerZones = createTriggerZones(6.12);
        triggerZones.forEach(zone => three.scene.add(zone));
        setupTriggerInteraction(triggerZones);
        initPlayer(three.scene, three.renderer, three.controls, three.controlsPointer);
        startworld();
        initializeControlMode();
    });   
});