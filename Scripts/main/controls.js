// Scripts/controls.js
import * as THREE from 'three';
import { three, app, game, ui } from '../state.js';
import { getstaticObjects, getReferenceDynamicObjects, rotateLayer } from '../cube.js';
import { updateOrbitButton, showOrbitNotification } from './mobileControls.js';
import { getArrows, showArrows, hideArrows } from './arrows.js';
import { getControlMode } from '../controlMode.js';
import { COLORS } from '../utils/colors.js';
import { cLog } from '../utils/logger.js';

const raycaster = new THREE.Raycaster();
const MOUSE_CONTROL_SENSITIVITY = 5;

let selectedCube = null;
let startObject = null;
let selectedCubeForMouse = null;
let startX = 0, startY = 0;
let rotationInProgress = false; 
let prevTouchesCount = 0;
let isPinching = false;
let isOrbiting = false;
let initialPinchDistance = 0;
let initialOrbitCenter = new THREE.Vector2();

export function setupTriggerInteraction(triggerZones) {
    window.addEventListener('mousedown', (event) => {
        if (!game.active || event.button !== 0) return;
        if (three.controls.enabled) return;

        const mouse = getMouseNCD(event)

        raycaster.setFromCamera(mouse, three.camera);
        const staticObjects = getstaticObjects();

        const intersects = raycaster.intersectObjects(staticObjects, true); // статический

        if (intersects.length > 0) {
            const intersect = intersects[0];
            startObject = intersect.object;
            selectedCube = startObject.parent; // Получаем группу кубика

            // Если выбран режим "Мышь", запоминаем выбранный кубик
            cLog('проверка режима: ', getControlMode())
            if (getControlMode() === 'control_mouse_move'){
                app.isMouseDown = true;
                rotationInProgress = false;
                selectedCubeForMouse = selectedCube;
                startX = event.clientX;
                startY = event.clientY;
                document.body.classList.add('dragging');
            } else {                                 
                showArrows(selectedCube, mouse); 
            }
            cLog('mousedown: object=', startObject.name, 'parent=', selectedCube.name);
        } else {
            hideArrows();
            cLog('mousedown: no cube hit');
        }
    });

    window.addEventListener('mousemove', (event) => {
        if (!game.active) return
        if (three.controls.enabled) return;
        switch (getControlMode()){
            case 'control_arrows':
                document.body.classList.remove('dragging');
                control_arrows_mode(event);
                break;
            case 'control_mouse_move':
                if (app.isMouseDown) {document.body.classList.add('dragging')};
                control_mouseRotation_mode(event);
                break;
        }
    });
    
    window.addEventListener('mouseup', (event) => {
        if (!game.active) return
        if (three.controls.enabled) return;
        if (!selectedCube) return;

        if (getControlMode() === 'control_arrows'){
            const mouse = getMouseNCD(event)

            raycaster.setFromCamera(mouse, three.camera);
            const arrowIntersects = raycaster.intersectObjects(getArrows(), true);

            if (arrowIntersects.length > 0) {
                const arrow = arrowIntersects[0].object;
                let axis = arrow.userData.direction.clone();
                const isCounterclockwise = arrow.userData.isRotate && !arrow.userData.rotationDirection
                //cLog(`Rotate TRUE/FALSE ${isCounterclockwise ? 'ПРОТИВ' : 'ПО'}, axis=`, axis.toArray());           
                rotateLayer(selectedCube, axis, isCounterclockwise);
            }

            clearSelection()
            cLog('mouseup: arrows cleared');
        } else {
            app.isMouseDown = false;
            rotationInProgress = false;
            document.body.classList.remove('dragging')
            clearSelection()
        }
    });

    window.addEventListener('touchstart', (event) => {
        if (!game.active) return;

        const touchLen = event.touches.length;

        // Жест тремя пальцами - переключает орбиту
        if (touchLen === 3) {          
            // Только если не в процессе других действий
            // Переключаем орбиту
            three.controls.enabled = !three.controls.enabled;
            ui.orbitControlSet.innerText = three.controls.enabled ? 'вкл' : 'выкл';

            // Обновляем кнопку
            updateOrbitButton();
            // Показываем уведомление
            showOrbitNotification(three.controls.enabled);
            // Скрываем стрелки при включении
            if (three.controls.enabled) {
                hideArrows();
            }
            // Блокируем другие жесты на короткое время
            isOrbiting = true;
            setTimeout(() => {
                isOrbiting = false;
            }, 500);

            cLog(`Жест 3 пальцев: OrbitControls ${three.controls.enabled ? 'включены' : 'выключены'}`);
            return;
        }
        
        // Автоматическое включение орбиты при 2+ пальцах (опционально)
        if (app.isTouchDevice && touchLen >= 2 && !three.controls.enabled) {
            cLog('автовкл орбиты при 2+ пальцах');
            three.controls.enabled = true;
            ui.orbitControlSet.innerText = 'вкл';
            updateOrbitButton();
            showOrbitNotification(true);
            hideArrows();
        }

        if (touchLen === 1) {
            if (three.controls.enabled) return;
            const touch = event.touches[0];
            const mouseCoords = getMouseNCD(touch)

            raycaster.setFromCamera(mouseCoords, three.camera);
            const staticObjects = getstaticObjects();

            const intersects = raycaster.intersectObjects(staticObjects, true);

            if (intersects.length > 0) {
                const intersect = intersects[0];
                startObject = intersect.object;
                selectedCube = startObject.parent;

                if (getControlMode() === 'control_touch_trigger') {
                    showArrows(selectedCube, mouseCoords);
                } else if (getControlMode() === 'control_touch_move') {
                    app.isMouseDown = true;
                    rotationInProgress = false;
                    selectedCubeForMouse = selectedCube;
                    startX = touch.clientX;
                    startY = touch.clientY;
                    cLog(document.body)                    
                    hideArrows();
                }
            } else {
                hideArrows();
            }

        } else if (touchLen === 2 && three.controls.enabled) {
            // Логика zoom
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            initialPinchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            isPinching = true;
            isOrbiting = false;
            app.isMouseDown = false;
            hideArrows();
            cLog('начат зум (два пальца)');
        }
        prevTouchesCount = event.touches.length
    });

    window.addEventListener('touchmove', (event) => {
        if (!game.active) return;

        const touchLen = event.touches.length;

        // обработка вращения орбиты (3 пальца)
        if (isOrbiting && touchLen === 3) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const currentOrbitCenter = new THREE.Vector2(
                (touch1.clientX + touch2.clientX) / 2,
                (touch1.clientY + touch2.clientY) / 2
            );

            // Рассчитываем сдвиг центра и изменение угла
            const deltaX = currentOrbitCenter.x - initialOrbitCenter.x;
            const deltaY = currentOrbitCenter.y - initialOrbitCenter.y;

            // Масштабируем сдвиг для чувствительности (подобно mouse-drag)
            const sensitivity = 0.005; // Подбирается экспериментально
            const deltaPhi = -deltaX * sensitivity; // Вращение вокруг Y (лево/право)
            const deltaTheta = -deltaY * sensitivity; // Вращение вокруг X (вверх/вниз)

            three.controls.rotateLeft(deltaPhi);
            three.controls.rotateUp(deltaTheta);
            three.controls.update();

            initialOrbitCenter.copy(currentOrbitCenter);
        }

        if (prevTouchesCount !== event.touches.length) {
            prevTouchesCount = event.touches.length;
            return;
        }

        if (isPinching && touchLen === 2 && three.controls.enabled) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const currentPinchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            const scalaDelta = currentPinchDistance / initialPinchDistance;

            three.controls.dolly(scalaDelta);
            three.controls.update();

            // Обновляем initialPinchDistance для следующего шага
            initialPinchDistance = currentPinchDistance;
            return; // Не обрабатываем другие жесты одновременно
        }

        if (!isPinching && !isOrbiting && touchLen >= 1) {
            if (three.controls.enabled) return;

            const touch = event.touches[0];

            if (getControlMode() === 'control_touch_trigger') {
                control_arrows_mode(touch);
            } else if (getControlMode() === 'control_touch_move' && app.isMouseDown) {
                control_mouseRotation_mode({ clientX: touch.clientX, clientY: touch.clientY });
                hideArrows()
            }
        }
    });

    window.addEventListener('touchend', (event) => {
        if (!game.active) return;

        // Если был жест 3 пальцев
        if (isOrbiting && event.touches.length < 3) { isOrbiting = false; }
        
        if (isPinching && event.touches.length < 2) { isPinching = false; }

        if (three.controls.enabled) {
            prevTouchesCount = event.touches.length;
            return;
        }

        if ((!isPinching && !isOrbiting && getControlMode() === 'control_touch_trigger') && selectedCube) {
            const touch = event.changedTouches[0];
            const mouse = getMouseNCD(touch)

            raycaster.setFromCamera(mouse, three.camera);
            const arrowIntersects = raycaster.intersectObjects(getArrows(), true);

            if (arrowIntersects.length > 0) {
                const arrow = arrowIntersects[0].object;
                let axis = arrow.userData.direction.clone();
                const isCounterclockwise = arrow.userData.isRotate && !arrow.userData.rotationDirection;
                rotateLayer(selectedCube, axis, isCounterclockwise);
            }

            clearSelection()
        } else if (!isPinching && !isOrbiting && getControlMode() === 'control_touch_move') {
            app.isMouseDown = false;
            rotationInProgress = false;
            clearSelection();
        }
        prevTouchesCount = event.touches.length
    });
}

function clearSelection() {
    hideArrows();
    selectedCube = null;
    selectedCubeForMouse = null;
}

export function getMouseNCD(event) { 
    if (app.CurrentActiveCam === 'player' && document.pointerLockElement === three.renderer.domElement) {
        return new THREE.Vector2(0, 0);
    }    

    const rect = three.renderer.domElement.getBoundingClientRect();
    return new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
    )
}

function resetMouse(){
    startX = 0;
    startY = 0;
}

function tryRotate(cube, axis, isCounterclockWise){
    if (rotationInProgress) return;
    // блокировка дальнейших вызовов на время задержки
    rotationInProgress = true;

    // вызов поворота
    rotateLayer(cube, axis, isCounterclockWise).then(() => {
       rotationInProgress = false;       
    });
}

function control_arrows_mode(event) {
    if (selectedCube) {                           
        
        const mouse = getMouseNCD(event);
        let arrows = getArrows()

        raycaster.setFromCamera(mouse, three.camera);
        const arrowIntersects = raycaster.intersectObjects(arrows, true);

        // Сбрасываем цвет всех стрелок до оригинального
        arrows.forEach(arrow => {
            const originalColor = arrow.material.userData.originalColor || arrow.material.color.getHex();
            arrow.material.color.set(originalColor);
        });

        // Устанавливаем подсветку только для пересечённой стрелки
        if (arrowIntersects.length > 0) {
            const arrow = arrowIntersects[0].object;
            arrow.material.color.set(COLORS.MAGENTA_PURPUR); // Подсветка при наведении
        } 
    }
}

function control_mouseRotation_mode(event) {
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    const sensitivity = MOUSE_CONTROL_SENSITIVITY;

    if (!selectedCubeForMouse || !app.isMouseDown || rotationInProgress) return;

    // получаем новое пересечение
    const mouse = getMouseNCD(event);

    raycaster.setFromCamera(mouse, three.camera);
    const intersects = raycaster.intersectObjects(getReferenceDynamicObjects(), true);

    if (intersects.length === 0) return;
    const intersect = intersects[0];
    const staticCube = intersect.object.parent;
    
    const normal = intersect.face.normal.clone().applyQuaternion(staticCube.quaternion);
    if (!normal) return;

    // Определяем оси вращения относительно нормали
    let upVector = new THREE.Vector3(0, 1, 0);
    if (Math.abs(normal.dot(upVector)) > 0.9) {
        upVector.set(0, 0, 1); // если нормаль почти вертикальна
    }

    const rightVector = new THREE.Vector3().crossVectors(normal, upVector).normalize();
    upVector.crossVectors(rightVector, normal).normalize();

    // Выбираем ось вращения
    let axis, isCounterclockWise;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > sensitivity) {
        axis = upVector.clone();
        isCounterclockWise = deltaX < 0;
    } else if (Math.abs(deltaY) > sensitivity) {
        axis = rightVector.clone();
        isCounterclockWise = deltaY > 0;
    } else {
        return; // выходим, если движение слишком маленькое
    }

    tryRotate(selectedCubeForMouse, axis, isCounterclockWise);
    resetMouse();
}