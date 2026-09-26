// Scripts/mobileControls.js
import * as THREE from 'three'
import { three, ui, game, app } from '../state.js'
import { hideArrows } from './arrows.js'
import { rotateWholeCube, solveCube, scrambleCube } from '../cube.js'
import { cLog } from '../utils/logger.js'

export function createMobileControls() {
    if (!app.isTouchDevice) return;
  
    // Контейнер основных кнопок
    const mobileControls = document.createElement('div');
    mobileControls.id = 'mobile-controls';
    mobileControls.className = 'mobile-control-container';
  
    const directions = [
      { id: 'mobile-up', symbol: '▼', dir: 'up' },
      { id: 'mobile-left', symbol: '◄', dir: 'left' },
      { id: 'mobile-orbit', symbol: '💫', dir: 'orbit' },
      { id: 'mobile-down', symbol: '▲', dir: 'down' },
      { id: 'mobile-right', symbol: '►', dir: 'right' },
    ];
  
    directions.forEach(({ id, symbol, dir }) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = id;
      btn.className = 'mobile-control-btn';
      btn.textContent = symbol;
      btn.setAttribute('aria-label', dir);
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (dir === 'orbit') {
          orbitMobileControl();
        } else {
          handleMobileControl(dir);
        }
      });
      mobileControls.appendChild(btn);
    });
  
    document.body.appendChild(mobileControls);

    // Добавьте стили для мобильных элементов управления
    const style = document.createElement('style');
    style.textContent = `
      .mobile-control-container {
        position: fixed;
        bottom: 20px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: space-around;
        z-index: 100;
        padding: 0 10px;
        box-sizing: border-box;
      }
  
      #extra-mobile-controls {
        position: fixed;
        top: 50%;
        right: 50px;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 12px;
        z-index: 100;
      }
  
      .mobile-control-btn {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: rgba(52, 152, 219, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        user-select: none;
        touch-action: none;
        margin: 0;
        border: solid 1.5px transparent;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
      }
  
      .extra-mobile-control-btn {
        flex-direction: column;
      }
  
      .btn-icon {
        line-height: 1;
      }
  
      .btn-label {
        font-size: 11px;
        line-height: 1.2;
        text-align: center;
        margin-top: 4px;
        white-space: nowrap;
      }
  
      #mobile-orbit {
        background-color: rgba(155, 89, 182, 0.7);
      }
  
      #mobile-orbit.orbit-active {
        background-color: rgba(231, 76, 60, 0.9);
        border-color: white;
        box-shadow: 0 0 15px rgba(231, 76, 60, 0.7);
      }
  
      @media (max-width: 768px) {
        .mobile-control-btn {
            width: 50px;
            height: 50px;
            font-size: 18px;
        }
            
        .extra-mobile-control-btn .btn-label {
          font-size: 9px;
        }

        #mobile-controls {
          bottom: 10px;
          padding: 5px;
        }
      }

      @media (max-width: 500px) {
        .mobile-control-btn {
            width: 40px;
            height: 40px;
            font-size: 16px;
        }

        #mobile-controls {
            bottom: 5px;
            padding: 3px;
        }
      }

      @media (max-width: 400px) {
        .mobile-control-btn {
            width: 35px;
            height: 35px;
            font-size: 14px;
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
        case 'revers-solve': solveCube(); break;
        case 'scramble': scrambleCube(20); break;
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

export function createExtraMobileControls() {
    if (!app.isTouchDevice) return;

    if (document.getElementById('extra-mobile-controls')) return;

    const extraControls = document.createElement('div');
    extraControls.id = 'extra-mobile-controls';
    extraControls.style.display = 'none';   // ← добавить

    const extras = [
        {
            id: 'mobile-revers-solve',
            symbol: '🔙',
            label: 'сборка',
            action: () => handleMobileControl('revers-solve'),
            aria: 'Вернуться к сборке',
        },
        {
            id: 'mobile-revers-scramble',
            symbol: '🎲',
            label: 'разборка',
            action: () => handleMobileControl('scramble'),
            aria: 'Перемешать куб',
        },
    ];

    extras.forEach(({ id, symbol, label, action, aria }) => {
        const wrapper = document.createElement('button');
        wrapper.type = 'button';
        wrapper.id = id;
        wrapper.className = 'mobile-control-btn extra-mobile-control-btn';
        wrapper.setAttribute('aria-label', aria);

        const icon = document.createElement('span');
        icon.textContent = symbol;
        icon.className = 'btn-icon';

        const text = document.createElement('span');
        text.textContent = label;
        text.className = 'btn-label';

        wrapper.appendChild(icon);
        wrapper.appendChild(text);
        wrapper.addEventListener('touchstart', (e) => {
            e.preventDefault();
            action();
        });

        extraControls.appendChild(wrapper);
    });

    document.body.appendChild(extraControls);
}

export function updateExtraMobileControlsVisibility() {
    const el = document.getElementById('extra-mobile-controls');
    if (!el) return;
    el.style.display = game.mode === 'free' ? 'flex' : 'none';
}