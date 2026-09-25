// Scripts/cube/rotation.js
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { cube, game, app } from '../state.js';
import { cLog } from '../utils/logger.js'
import { getCubesInLayer } from './raycaster.js';
import { isCubeSolved } from './solved.js';

export function rotateLayer(object, normal, isCounterclockwise = false) {
    return new Promise((resolve) => {
        if (cube.isRotating || !object.parent || !normal.lengthSq()) {
            let cubeIsRotating = cube.isRotating
            cLog('rotateLayer: blocked', { cubeIsRotating, hasParent: !!object.parent, normalLength: normal.lengthSq() });
            resolve();
            return;
        }
        // cLog('Вращение🔃: ', {
        //     object: object.name,
        //     normal: { x: normal.x, y: normal.y, z: normal.z },
        //     camMode: app.CurrentActiveCam,
        //     direction: isCounterclockwise ? 'против часовой' : 'по часовой'
        // });

        const speedRotate = app.speedSet;
        const layerData = getCubesInLayer(normal, object);
        cube.cubesToRotate = layerData.cubes;

        // cLog('rotateLayer: cubes to rotate=', cubesToRotate.length);
        if (cube.cubesToRotate.length === 0) {
            cLog('rotateLayer: no cubes to rotate');
            resolve();
            return;
        }

        // Сохранение истории вращения
        cube.historyrotation.push({
            type: 'layer',
            objectName: object.name,
            normal: normal.clone(),
            isCounterclockWise: isCounterclockwise
        })

        if (cube.arrowHelper) {
            cube.scene.remove(cube.arrowHelper);
            cube.arrowHelper = null;
        }
        cube.progressArrows.forEach(arrow => cube.scene.remove(arrow));
        cube.progressArrows = [];

        cube.rotationGroup = new THREE.Group();
        const centerPoint = new THREE.Vector3();
        cube.cubesToRotate.forEach(cubeObj => {
            const pos = new THREE.Vector3();
            cubeObj.getWorldPosition(pos);
            centerPoint.add(pos);
        });
        centerPoint.divideScalar(cube.cubesToRotate.length);

        cube.rotationGroup.position.copy(centerPoint);
        cube.scene.add(cube.rotationGroup);

        cube.cubesToRotate.forEach(cubeObj => {
            const pos = new THREE.Vector3();
            cubeObj.getWorldPosition(pos);
            cubeObj.position.copy(pos.sub(centerPoint));
            cube.scene.remove(cubeObj);
            cube.rotationGroup.add(cubeObj);
        });

        cube.rotationAxis.copy(normal).normalize();
        cube.isRotating = true;

        updateProgressArrows(0);
        cube.arrowHelper = new THREE.ArrowHelper(cube.rotationAxis, cube.rotationGroup.position, 2, 0xff0000);
        cube.scene.add(cube.arrowHelper);

        const targetAngle = isCounterclockwise ? -Math.PI / 2 : Math.PI / 2;
        const duration =  speedRotate;
        const startTime = performance.now();

        function animateRotation(currentTime) {            
            if (!cube.rotationGroup) {
                resolve();
                return;
            }
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const angle = targetAngle * progress;

            cube.rotationGroup.rotation.set(0, 0, 0);
            cube.rotationGroup.rotateOnAxis(cube.rotationAxis, angle);

            if (progress < 1) {
                requestAnimationFrame(animateRotation);
            } else {
                finishRotation();
                if (!cube.isScrambling) { // <-- Не обновляем прогресс во время перемешивания                   
                    if (isCubeSolved()){ // Проверяем, собран ли кубик
                        cube.historyrotation = [];
                        cLog('Куб собран');
                    }
                }       
                resolve();
            }
        }

        requestAnimationFrame(animateRotation);

        const audio = document.getElementById('rotation_sound');
        audio.currentTime = 0;
        if (game.state_sounds === 2 || game.state_sounds === 3){
            audio.play().catch(e => console.error('не удалось загрузить музыку'));
        }
    });
}

export async function rotateWholeCube(axis, isCounterclockwise = false) {
    return new Promise((resolve) => {
        if (cube.isRotating) {
            cLog('rotateWholeCube: blocked, rotation in progress');
            resolve();
            return;
        }

        // Сохранение истории вращения
        cube.historyrotation.push({
            type: 'whole',
            axis: axis.clone(),
            isCounterclockWise: isCounterclockwise
        })

        // Создаём группу для вращения
        cube.rotationGroup = new THREE.Group();
        const centerPoint = new THREE.Vector3(0, 5, 0); // Центр кубика
        cube.rotationGroup.position.copy(centerPoint);
        cube.scene.add(cube.rotationGroup);

        // Сохраняем начальные позиции и кватернионы всех кубиков
        const initialStates = new Map();
        cube.objects.forEach(cubeObj => {
            const pos = new THREE.Vector3();
            cubeObj.getWorldPosition(pos);
            const quat = cubeObj.getWorldQuaternion(new THREE.Quaternion());
            initialStates.set(cubeObj, { position: pos.clone(), quaternion: quat.clone() });
            // Перемещаем кубик в cube.rotationGroup
            cubeObj.position.copy(pos.sub(centerPoint));
            cube.scene.remove(cubeObj);
            cube.rotationGroup.add(cubeObj);
        });

        cube.rotationAxis.copy(axis).normalize();
        cube.isRotating = true;

        // Очищаем и создаём стрелки
        if (cube.arrowHelper) {
            cube.scene.remove(cube.arrowHelper);
            cube.arrowHelper = null;
        }
        cube.progressArrows.forEach(arrow => cube.scene.remove(arrow));
        cube.progressArrows = [];
        updateProgressArrows(0);
        cube.arrowHelper = new THREE.ArrowHelper(cube.rotationAxis, cube.rotationGroup.position, 2, 0xff0000);
        cube.scene.add(cube.arrowHelper);

        const targetAngle = isCounterclockwise ? -Math.PI / 2 : Math.PI / 2;
        const duration = 300;
        const startTime = performance.now();

        function animateRotation(currentTime) {
            if (!cube.rotationGroup) {
                resolve();
                return;
            }
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const angle = targetAngle * progress;

            cube.rotationGroup.rotation.set(0, 0, 0);
            cube.rotationGroup.rotateOnAxis(cube.rotationAxis, angle);

            updateProgressArrows(angle);

            if (progress < 1) {
                requestAnimationFrame(animateRotation);
            } else {
                finishWholeRotation(initialStates);
                if (!cube.isScrambling) { // <-- Не обновляем прогресс во время перемешивания
                     if (isCubeSolved()){ // Проверяем, собран ли кубик
                        cube.historyrotation = [];
                        cLog('Куб собран');
                    }
                }      
                resolve();
            }
        }

        requestAnimationFrame(animateRotation);
    });
}

function finishWholeRotation(initialStates) {
    if (!cube.rotationGroup) return;

    // Переносим кубики обратно в сцену
    const tempContainer = new THREE.Group();
    cube.scene.add(tempContainer);
    tempContainer.position.copy(cube.rotationGroup.position);
    tempContainer.quaternion.copy(cube.rotationGroup.quaternion);

    while (cube.rotationGroup.children.length > 0) {
        const cubeNew = cube.rotationGroup.children[0];
        const originalPos = new THREE.Vector3().copy(cubeNew.position);
        cube.rotationGroup.remove(cubeNew);
        tempContainer.add(cubeNew);
        cubeNew.position.copy(originalPos);
    }

    while (tempContainer.children.length > 0) {
        const cubeNew = tempContainer.children[0];
        const worldPos = new THREE.Vector3();
        cubeNew.getWorldPosition(worldPos);
        const worldQuat = cubeNew.getWorldQuaternion(new THREE.Quaternion());

        tempContainer.remove(cubeNew);
        cube.scene.attach(cubeNew);
        cubeNew.position.copy(worldPos);
        cubeNew.quaternion.copy(worldQuat);

        // Обновляем referencePositions для корректной работы других функций
        cube.referencePositions.set(cubeNew.name, {
            position: worldPos.clone(),
            quaternion: worldQuat.clone()
        });
    }

    cube.scene.remove(tempContainer);
    if (cube.arrowHelper) {
        cube.scene.remove(cube.arrowHelper);
        cube.arrowHelper = null;
    }
    cube.progressArrows.forEach(arrow => cube.scene.remove(arrow));
    cube.progressArrows = [];
    cube.scene.remove(cube.rotationGroup);
    cube.isRotating = false;
    cube.rotationGroup = null;
    cube.cubesToRotate = []; // Очищаем, чтобы не мешать rotateLayer

    // Синхронизируем физику
    if (cube.bodies.length > 0 && cube.bodies[0] && cube.bodies[0].body && cube.bodies[0].mesh) {
        const centerPos = new THREE.Vector3(0, 5, 0);
        cube.bodies[0].body.position.copy(new CANNON.Vec3(centerPos.x, centerPos.y, centerPos.z));
        cube.bodies[0].mesh.position.copy(centerPos);
        // Кватернион физического тела не обновляем, так как вращение затрагивает только визуальные кубики
    }

    if (!cube.isScrambling && game.active) {
        // Используем обновленную логику isCubeSolved
        isCubeSolved(false);
    }
}

function finishRotation() {
    if (!cube.rotationGroup) return;

    cube.cubesToRotate.forEach(cubeObj => {
        cubeObj.traverse(child => {
            if (child.isMesh && cube.originalMaterials.has(child.uuid)) {
                child.material = cube.originalMaterials.get(child.uuid).clone();
                child.material.needsUpdate = true;
                child.geometry.computeVertexNormals();
                if (child.material.emissive) {
                    child.material.emissiveIntensity = 0;
                }
            }
        });
    });

    const tempContainer = new THREE.Group();
    cube.scene.add(tempContainer);
    tempContainer.position.copy(cube.rotationGroup.position);
    tempContainer.quaternion.copy(cube.rotationGroup.quaternion);

    while (cube.rotationGroup.children.length > 0) {
        const cubeNew = cube.rotationGroup.children[0];
        const originalPos = new THREE.Vector3().copy(cubeNew.position);
        cube.rotationGroup.remove(cubeNew);
        tempContainer.add(cubeNew);
        cubeNew.position.copy(originalPos);
    }

    while (tempContainer.children.length > 0) {
        const cubeNew = tempContainer.children[0];
        const worldPos = new THREE.Vector3();
        cubeNew.getWorldPosition(worldPos);
        const worldQuater = cubeNew.getWorldQuaternion(new THREE.Quaternion());

        tempContainer.remove(cubeNew);
        cube.scene.attach(cubeNew);
        cubeNew.position.copy(worldPos);
        cubeNew.quaternion.copy(worldQuater);
    }

    cube.scene.remove(tempContainer);
    if (cube.arrowHelper) {
        cube.scene.remove(cube.arrowHelper);
        cube.arrowHelper = null;
    }
    cube.progressArrows.forEach(arrow => cube.scene.remove(arrow));
    cube.progressArrows = [];
    cube.scene.remove(cube.rotationGroup);
    cube.isRotating = false;
    cube.cubesToRotate = [];
    cube.rotationGroup = null;

    // физика
    if (cube.bodies.length > 0 && cube.bodies[0] && cube.bodies[0].body && cube.bodies[0].mesh){
        cube.bodies[0].body.position.copy(new CANNON.Vec3(0, 5, 0));
        cube.bodies[0].mesh.position.copy(new THREE.Vector3(0, 5, 0));
    }


    if (!cube.isScrambling && game.active) {
        // Используем обновленную логику isCubeSolved
        isCubeSolved(false);
    }
}

function updateProgressArrows(currentAngle) {
    cube.progressArrows.forEach(arrow => cube.scene.remove(arrow));
    cube.progressArrows = [];

    const progress = Math.min(Math.abs(currentAngle) / (Math.PI / 2), 1);
    const startColor = new THREE.Color(0xff0000);
    const endColor = new THREE.Color(0x00ff00);
    const arrowColor = startColor.clone().lerp(endColor, progress);

    const arrowLength = 2 + progress * 1;
    const arrow1 = new THREE.ArrowHelper(cube.rotationAxis, cube.rotationGroup.position, arrowLength, arrowColor.getHex(), 0.3, 0.1);
    cube.scene.add(arrow1);
    cube.progressArrows.push(arrow1);

    const arrow2 = new THREE.ArrowHelper(cube.rotationAxis.clone().negate(), cube.rotationGroup.position, arrowLength, arrowColor.getHex(), 0.3, 0.1);
    cube.scene.add(arrow2);
    cube.progressArrows.push(arrow2);
}

