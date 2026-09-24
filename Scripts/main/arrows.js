// Scripts/arrows.js
import * as THREE from 'three'
import { three, game } from '../state.js'
import { COLORS } from '../utils/colors.js'
import { isMobile, isTablet } from '../utils/device.js'
import { getstaticObjects } from '../cube.js'
import { cLog, cWarn } from '../utils/logger.js'

const raycaster = new THREE.Raycaster();
let arrows = []; // Массив для стрелок

// сопоставление цвета грани на повороты
const rotationMap = {
    0xff0000: { 0x00ff00: [Math.PI, 0, 0], 0xffff00: [0, 0, -Math.PI], 0x0000ff: [Math.PI, 0, 0] }, // Красная грань
    0x00ff00: { 0x00ff00: [Math.PI, 0, 0], 0xffff00: [0, 0, Math.PI / 2], 0x0000ff: [0, 0, -Math.PI / 2] }, // Зеленая грань
    0xffffff: { // белая грань
        0xff0000: [Math.PI / 2, 0, -Math.PI / 2], // Красная стрелка ↑
        0x00ff00: [Math.PI / 2, 0, -Math.PI / 2], // Зеленая стрелка ↓
        0x0000ff: [-Math.PI / 2, 0, -Math.PI / 2],// Синяя   стрелка →
        0xffff00: [Math.PI / 2, 0, -Math.PI / 2], // Желтая  стрелка ←
    },
    0xffff00: { // Желтая грань
        0xff0000: [Math.PI / 2, 0, Math.PI / 2],
        0x00ff00: [Math.PI / 2, 0, Math.PI / 2],
        0x0000ff: [-Math.PI / 2, 0, Math.PI / 2],
        0xffff00: [Math.PI, 0, Math.PI / 2],
    },
    0x0000ff: { // Синяя грань
        0x00ff00: [0, 0, Math.PI],
        0x0000ff: [-Math.PI / 2, 0, Math.PI / 2],
        0xffff00: [Math.PI / 2, 0, -Math.PI / 2],
    },
    0xffa500: { /* Оранжевая грань */ 0x00ff00: [Math.PI, 0, 0] }
};

// переменные для размера стрелок и сфер
const sizeObjectsControls = {
    minSizePC: { Sphere: new THREE.SphereGeometry(0.2, 16, 16), Cone: new THREE.ConeGeometry(0.3, 0.6, 8) },
    midSizeTablet: { Sphere: new THREE.SphereGeometry(0.4, 16, 16), Cone: new THREE.ConeGeometry(0.5, 0.8, 8) },
    bigSizePhone: { Sphere: new THREE.SphereGeometry(0.5, 16, 16), Cone: new THREE.ConeGeometry(0.6, 0.9, 8) }
}

export function pickArrowGeometry(isRotate) {
    const set = isMobile() ? sizeObjectsControls.bigSizePhone 
    : isTablet() ? sizeObjectsControls.midSizeTablet
    : sizeObjectsControls.minSizePC;
    return isRotate ? set.Sphere : set.Cone;
}

export function createArrow(position, direction, color = COLORS.GREEN, isRotate = false, faceColor = COLORS.GREEN) {
    if (!game.active) return; 
    const geometry = pickArrowGeometry(isRotate);
    const material = new THREE.MeshBasicMaterial({ color });
    const arrow = new THREE.Mesh(geometry, material);
    arrow.position.copy(position);
    // Сохраняем цвет
    material.userData = { originalColor: color };

    if (!isRotate) {
        // Направление стрелки в мировой системе координат
        const worldDirection = direction.clone().normalize();
        arrow.lookAt(position.clone().add(worldDirection.multiplyScalar(-1)));

        const rot = rotationMap[faceColor]?.[color];
        if (rot){
            arrow.rotateX(rot[0]);
            arrow.rotateY(rot[1]);
            arrow.rotateZ(rot[2]);
        }

        // Блокируем вращение стрелки
        arrow.matrixAutoUpdate = false;
        arrow.updateMatrix();
    }

    arrow.userData = { direction };
    if (isRotate) {
        arrow.userData.isRotate = true;
        // Указываем направление вращения: по часовой (true) или против (false)
        arrow.userData.rotationDirection = color === COLORS.DARK_TURQUOISE ? false : true;
    }
    three.scene.add(arrow);
    return arrow;
}

export function showArrows(cube, mouseCoords) {
    if (!mouseCoords){
        cWarn("showArrows: координаты не переданы, невозможно определить грань.");
        return;
    }
    const blurM = document.getElementById('blurmenu')
    if (blurM && blurM.style.display === 'block') { return; }
    // Удаляем старые стрелки
    arrows.forEach(arrow => three.scene.remove(arrow));
    arrows = [];

    let extraOffsetCone = 1;
    let extraOffsetSphere = 1

    if (isMobile()) { extraOffsetCone = 2.6; extraOffsetSphere = 3}
    if (isTablet()) { extraOffsetCone = 2.5; extraOffsetSphere = 3}

    const cubeSize = 6.12 / 3; // Размер одного кубика
    const offset = (cubeSize * 0.5) * extraOffsetCone; // Отступ для стрелок
    const extrudeOffset = cubeSize * 0.1; // Смещение стрелок наружу
    const sphereOffset = (cubeSize * 0.101) * extraOffsetSphere; // Смещение шаров по вертикале

    // Находим грань, на которую кликнули
    raycaster.setFromCamera(mouseCoords, three.camera);
    const intersects = raycaster.intersectObjects([cube], true);
    if (intersects.length === 0) return;

    const intersect = intersects[0];
    const normal = intersect.face.normal.clone().applyMatrix4(cube.matrixWorld).sub(cube.getWorldPosition(new THREE.Vector3())).normalize();

    // Позиция центра кликнутой грани
    const position = cube.getWorldPosition(new THREE.Vector3()).add(normal.clone().multiplyScalar(cubeSize * 0.5));

    // Определяем цвет грани на основе нормали
    let faceColor;
    const absNormal = new THREE.Vector3(Math.abs(normal.x), Math.abs(normal.y), Math.abs(normal.z));
    if (absNormal.x > 0.9) {
        faceColor = normal.x > 0 ? COLORS.RED : COLORS.ORANGE; // Красная или оранжевая грань
    } else if (absNormal.y > 0.9) {
        faceColor = normal.y > 0 ? COLORS.WHITE : COLORS.YELLOW; // Белая или жёлтая грань
    } else if (absNormal.z > 0.9) {
        faceColor = normal.z > 0 ? COLORS.GREEN : COLORS.BLUE; // Зелёная или синяя грань
    }

    // Вычисляем векторы "вверх" и "вправо" на основе нормали кликнутой грани
    let upVector = new THREE.Vector3(0, 1, 0); // Начальный "вверх"
    if (Math.abs(normal.dot(upVector)) > 0.9) {
        upVector.set(0, 0, 1); // Если нормаль близка к Y, используем Z как "вверх"
    }
    const rightVector = new THREE.Vector3().crossVectors(normal, upVector).normalize();
    upVector.crossVectors(rightVector, normal).normalize();

    // Смещение для "выдавливания" стрелок за грань
    const extrudeVector = normal.clone().multiplyScalar(extrudeOffset);

    // Определяем, является ли кликнутый кубик центральным
    const cubesObjects = getstaticObjects();
    const centerCubes = cubesObjects.filter(item => item.name.includes("CENTER"));
    const isCenterCube = centerCubes.some(center => center === cube || center.uuid === cube.uuid);

    // Стрелки для всех направлений (⬆⬇⬅➡)
    const directions = [
        { dir: rightVector.clone(), pos: upVector.clone().multiplyScalar(offset), color: COLORS.RED }, // ↑ (красный)
        { dir: rightVector.clone().negate(), pos: upVector.clone().negate().multiplyScalar(offset), color: COLORS.GREEN }, // ↓ (зелёный)
        { dir: upVector.clone(), pos: rightVector.clone().negate().multiplyScalar(offset), color: COLORS.BLUE }, // → (синий)
        { dir: upVector.clone().negate(), pos: rightVector.clone().multiplyScalar(offset), color: COLORS.YELLOW }, // ← (желтый)
    ];

    directions.forEach(({ dir, pos, color }) => {
        const arrowPos = position.clone().add(extrudeVector).add(pos);
        const arrow = createArrow(arrowPos, dir, color, false, faceColor);
        arrows.push(arrow);
    });

    // Добавляем шары только для центральных кубиков сторон
    if (isCenterCube) {
        const centerPos = position.clone().add(extrudeVector); // Центр грани
        // Бирюзовый шар (по часовой) чуть выше центра
        const turquoisePos = centerPos.clone().add(upVector.clone().multiplyScalar(sphereOffset + 0.025));
        const counterclockwiseSphere = createArrow(turquoisePos, normal, COLORS.DARK_TURQUOISE, true); // тёмно Бирюзовый шар
        // Чёрный шар (против часовой) чуть ниже центра
        const blackPos = centerPos.clone().add(upVector.clone().negate().multiplyScalar(sphereOffset + 0.025));
        const clockwiseSphere = createArrow(blackPos, normal, COLORS.NEARLY_BLACK, true); // почти Чёрный шар 
        arrows.push(clockwiseSphere, counterclockwiseSphere);
    }   
    cLog(`Total arrows created: ${arrows.length}`);
}


export function hideArrows() {
    arrows.forEach(arrow => three.scene.remove(arrow));
    arrows = [];
}

export function getArrows() { return arrows}
