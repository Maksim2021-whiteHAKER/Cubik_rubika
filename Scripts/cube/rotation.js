// Scripts/cube/rotation.js
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { cube, game, app } from '../state.js';
import { cLog } from '../utils/logger.js'
import { getCubesInLayer } from './raycaster.js';
import { isCubeSolved } from './solved.js';

export function rotateLayer(object, normal, isCounterclockwise = false, {record = true} = {}) {
    if (cube.isRotating || !object.parent || !normal.lengthSq()) {
        cLog('rotateLayer: blocked', {
            cubeIsRotating: cube.isRotating,
            hasParent: !!object.parent,
            normalLength: normal.lengthSq()
        });
        return Promise.resolve();
    }

    const layerData = getCubesInLayer(normal, object);
    // cLog('rotateLayer: cubes to rotate=', cubesToRotate.length);
    if (layerData.cubes.length === 0) {
        cLog('rotateLayer: no cubes to rotate');
        return Promise.resolve();
    }

    cube.cubesToRotate = layerData.cubes;

    // Сохранение истории вращения
    if (record) {
        cube.historyrotation.push({
            type: 'layer',
            objectName: object.name,
            normal: normal.clone(),
            isCounterclockWise: isCounterclockwise,
            layerAxis: layerData.axis,
            layerCoord: layerData.coord
        });
    }

    return startRotationAnimation({
        targets: layerData.cubes,
        axis: normal,
        isCounterclockwise,
        duration: app.speedSet,
        pivot: computeCubesPivot(layerData.cubes),
        // отличия от вращения всего куба
        restoreMaterials: true,
        saveReferencePositions: false,
        updateProgressInLoop: false,
        playSound: true,
    });
}

export async function rotateWholeCube(axis, isCounterclockwise = false, { record = true} = {}) { 
    if (cube.isRotating) {
        cLog('rotateWholeCube: blocked, rotation in progress');
        return Promise.resolve();
    }

    // Сохранение истории вращения
    if (record) {
        cube.historyrotation.push({
            type: 'whole',
            axis: axis.clone(),
            isCounterclockWise: isCounterclockwise
        })
    }

    return startRotationAnimation({
        targets: cube.objects,
        axis: axis,
        isCounterclockwise,
        duration: 300,
        pivot: new THREE.Vector3(0, 5, 0),
        // отличия от вращения всего куба
        restoreMaterials: false,
        saveReferencePositions: true,
        updateProgressInLoop: true,
        playSound: false,
    });
}

function startRotationAnimation({targets, axis, isCounterclockwise, duration, pivot, restoreMaterials, saveReferencePositions, updateProgressInLoop, playSound}) {
    return new Promise((resolve) => {
        if (cube.arrowHelper) {
            cube.scene.remove(cube.arrowHelper)
            cube.arrowHelper = null;
        }
        cube.progressArrows.forEach(arrow => cube.scene.remove(arrow));
        cube.progressArrows = [];

        cube.rotationGroup = new THREE.Group();
        cube.rotationGroup.position.copy(pivot);
        cube.scene.add(cube.rotationGroup);

        targets.forEach(obj => {
            const pos = new THREE.Vector3();
            obj.getWorldPosition(pos);
            obj.position.copy(pos.sub(pivot));
            cube.scene.remove(obj);
            cube.rotationGroup.add(obj);
        })

        cube.rotationAxis.copy(axis).normalize();
        cube.isRotating = true;

        updateProgressArrows(0);
        cube.arrowHelper = new THREE.ArrowHelper(
            cube.rotationAxis, cube.rotationGroup.position, 2, 0xff0000
        );
        cube.scene.add(cube.arrowHelper);

        const targetAngle = isCounterclockwise ? -Math.PI / 2 : Math.PI / 2;
        const startTime = performance.now();

        function animateRotation(currentTime) {
            if (!cube.rotationGroup) { resolve(); return }

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const angle = targetAngle * progress;

            cube.rotationGroup.rotation.set(0, 0, 0);
            cube.rotationGroup.rotateOnAxis(cube.rotationAxis, angle);

            if (updateProgressInLoop) updateProgressArrows(angle);

            if (progress < 1) {
                requestAnimationFrame(animateRotation);
            } else {
                finishRotation({ restoreMaterials, saveReferencePositions});

                if (!cube.isScrambling && isCubeSolved()) {
                    cube.historyrotation = [];
                    cLog('✅ Куб собран!');
                }
                resolve();
            }
        }

        requestAnimationFrame(animateRotation);

        if (playSound) {
            const audio = document.getElementById('rotation_sound');
            audio.currentTime = 0;
            if (game.state_sounds === 2 || game.state_sounds === 3) {
                audio.play().catch(e => console.error('не удалось загрузить музыку'));
            }
        }
    });
}

function computeCubesPivot(cubes) {
    const center = new THREE.Vector3();
    cubes.forEach((cObj) => {
        const pos = new THREE.Vector3();
        cObj.getWorldPosition(pos);
        center.add(pos);
    });
    return center.divideScalar(cubes.length);
}

function finishRotation({ restoreMaterials, saveReferencePositions }) {
    if (!cube.rotationGroup) return;

    // 1. Восстановление материалов (только для слоя)
    if (restoreMaterials) {
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
    }

    // 2. Bake world transform через temp container
    const tempContainer = new THREE.Group();
    cube.scene.add(tempContainer);
    tempContainer.position.copy(cube.rotationGroup.position);
    tempContainer.quaternion.copy(cube.rotationGroup.quaternion);

    while (cube.rotationGroup.children.length > 0) {
        const c = cube.rotationGroup.children[0];
        const originalPos = new THREE.Vector3().copy(c.position);
        cube.rotationGroup.remove(c);
        tempContainer.add(c);
        c.position.copy(originalPos);
    }

    while (tempContainer.children.length > 0) {
        const c = tempContainer.children[0];
        const worldPos = new THREE.Vector3();
        c.getWorldPosition(worldPos);
        const worldQuat = c.getWorldQuaternion(new THREE.Quaternion());

        tempContainer.remove(c);
        cube.scene.attach(c);
        c.position.copy(worldPos);
        c.quaternion.copy(worldQuat);

        // Обновление referencePositions (только для whole-cube)
        if (saveReferencePositions) {
            cube.referencePositions.set(c.name, {
                position: worldPos.clone(),
                quaternion: worldQuat.clone()
            });
        }
    }

    cube.scene.remove(tempContainer);

    // 3. Уборка
    if (cube.arrowHelper) {
        cube.scene.remove(cube.arrowHelper);
        cube.arrowHelper = null;
    }
    cube.progressArrows.forEach(a => cube.scene.remove(a));
    cube.progressArrows = [];
    cube.scene.remove(cube.rotationGroup);
    cube.isRotating = false;
    cube.rotationGroup = null;
    cube.cubesToRotate = [];

    // 4. Синхронизация якоря физики
    const bodies = cube.bodies;
    if (bodies.length > 0 && bodies[0] && bodies[0].body && bodies[0].mesh) {
        const centerPos = new THREE.Vector3(0, 5, 0);
        bodies[0].body.position.copy(new CANNON.Vec3(centerPos.x, centerPos.y, centerPos.z));
        bodies[0].mesh.position.copy(centerPos);
    }

    // 5. Проверка «собран ли куб» после вращения
    if (!cube.isScrambling && game.active) {
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
    const arrow1 = new THREE.ArrowHelper(
        cube.rotationAxis, cube.rotationGroup.position, arrowLength, arrowColor.getHex(), 0.3, 0.1
    );
    cube.scene.add(arrow1);
    cube.progressArrows.push(arrow1);

    const arrow2 = new THREE.ArrowHelper(
        cube.rotationAxis.clone().negate(), cube.rotationGroup.position, arrowLength, arrowColor.getHex(), 0.3, 0.1
    );
    cube.scene.add(arrow2);
    cube.progressArrows.push(arrow2);
}