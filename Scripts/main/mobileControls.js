// Scripts/mobileControls.js
import * as THREE from 'three'
import { three, ui, game, app } from '../state.js'
import { hideArrows } from './arrows.js'
import { rotateWholeCube } from '../cube.js'
import { cLog } from '../utils/logger.js'

export function createMobileControls(){
    if (!app.isTouchDevice) return;

    const mobileControls = document.createElement('div');
    mobileControls.id = 'mobile-controls'
    mobileControls.innerHTML = `
        <div class="mobile-control-btn" id="mobile-up">▼</div>
        <div class="mobile-control-btn" id="mobile-left">◄</div>
        <div class="mobile-control-btn" id="mobile-orbit">💫</div>
        <div class="mobile-control-btn" id="mobile-down">▲</div>
        <div class="mobile-control-btn" id="mobile-right">►</div>
    `;
    document.body.appendChild(mobileControls);

    document.getElementById('mobile-up').addEventListener('touchstart', () => handleMobileControl('up'));
    document.getElementById('mobile-left').addEventListener('touchstart', () => handleMobileControl('left'));
    document.getElementById('mobile-orbit').addEventListener('touchstart', (e) => {
        e.preventDefault();
        orbitMobileControl();
    })
    document.getElementById('mobile-down').addEventListener('touchstart', () => handleMobileControl('down'));
    document.getElementById('mobile-right').addEventListener('touchstart', () => handleMobileControl('right'));

    // Добавьте стили для мобильных элементов управления
    const style = document.createElement('style');
    style.textContent = `
        #mobile-controls {
            position: fixed;
            bottom: 20px;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: space-around;
            z-index: 100;
        }
        
        .control-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: rgba(52, 152, 219, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            user-select: none;
            touch-action: none;
            margin: 5px;
            transition all 0.2s;
            border: solid 1.5px transparent
        }

        #mobile-orbit {
            background-color: rgba(155, 89, 182, 0.7);          
            width: 60px;
            height: 60px;
            font-size: 30px;
        }

        #mobile-orbit.orbit-active {
            background-color: rgba(231, 76, 60, 0.9);
            border-color: white;
            box-shadow: 0 0 15px rgba(231, 76, 60, 0.7);
        }
        
        @media (max-width: 768px) {
            .control-btn {
                width: 50px;
                height: 50px;
                font-size: 16px;
            }
        }
    `;
    document.head.appendChild(style);

    updateOrbitButton()
}

export function handleMobileControl(direction) {
    if (!game.active) return;

    switch (direction) {
        case 'up':
            rotateWholeCube(new THREE.Vector3(1, 0, 0), false);
            break;
        case 'down':
            rotateWholeCube(new THREE.Vector3(1, 0, 0), true);
            break;
        case 'left':
            rotateWholeCube(new THREE.Vector3(0, 1, 0), true);
            break;
        case 'right':
            rotateWholeCube(new THREE.Vector3(0, 1, 0), false);
            break;
        case 'rotate-x':
            rotateWholeCube(new THREE.Vector3(1, 0, 0), Math.random() > 0.5);
            break;
        case 'rotate-y':
            rotateWholeCube(new THREE.Vector3(0, 1, 0), Math.random() > 0.5);
            break;
        case 'rotate-z':
            rotateWholeCube(new THREE.Vector3(0, 0, 1), Math.random() > 0.5);
            break;
    }
}

export function orbitMobileControl() {
    if (!game.active) return;
    
    // Переключаем состояние орбиты
    three.controls.enabled = !three.controls.enabled;
    ui.orbitControlSet.innerText = three.controls.enabled ? 'вкл' : 'выкл';
    
    // Обновляем внешний вид кнопки
    updateOrbitButton();
    
    // Показываем уведомление
    showOrbitNotification(three.controls.enabled);
    
    // Скрываем стрелки при включении орбиты
    if (three.controls.enabled) {
        hideArrows();
    }
    
    cLog(`OrbitControls ${three.controls.enabled ? 'включены' : 'выключены'}`);
}

export function updateOrbitButton() {
    const orbitBtn = document.getElementById('mobile-orbit');
    if (!orbitBtn) return;
    
    if (three.controls.enabled) {
        orbitBtn.textContent = '✖';
        orbitBtn.classList.add('orbit-active');
        orbitBtn.title = 'Выключить управление камерой';
    } else {
        orbitBtn.textContent = '💫';
        orbitBtn.classList.remove('orbit-active');
        orbitBtn.title = 'Включить управление камерой';
    }
}

export function showOrbitNotification(isEnabled) {
    // Создаем временное уведомление
    const notification = document.createElement('div');
    notification.innerHTML = isEnabled ? 
        `Управление камерой включено 🔄 <br> Camera control is on` : 
        `Управление камерой выключено <br> Camera control is off`;
    
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-size: 16px;
        z-index: 1000;
        pointer-events: none;
        transition: opacity 0.3s;
        text-align: center;
    `;
    
    document.body.appendChild(notification);
    
    // Плавно исчезаем
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 1500);
}
