// CubeInteraction.js
import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';

/**
 * Создает невидимые триггерные зоны вокруг кубика для определения вращений по свайпу на ребрах.
 * @param {number} cubeSize Размер кубика (теперь 6.12).
 * @returns {THREE.Mesh[]} Массив мешей триггерных зон.
 */
export function createTriggerZones(cubeSize = 5.7) { // Устанавливаем размер по умолчанию 6.12
    const zones = [];
    const halfSize = cubeSize / 2; // Половина размера кубика (3.06)
    const smallCubeSize = cubeSize / 3; // Размер маленького кубика (2.04)

    // Позиции центров слоев вдоль каждой оси
    // Для кубика 3x3x3 размером 6.12, центрированного в (0,0,0)
    const layerPositions = [smallCubeSize, 0, -smallCubeSize]; // [2.04, 0, -2.04]

    // Размеры зоны. Можно сделать их немного больше размера грани маленького кубика.
    const zoneSize = smallCubeSize * 0.5; // Размер зоны вдоль ребра и перпендикулярно внутрь (например, 2.04 * 1.1 = ~2.24)
    const zoneThickness = smallCubeSize * 0.2; // Толщина зоны (насколько она выступает наружу) (например, 2.04 * 0.1 = ~0.2)
    const outwardOffset = zoneThickness / 2; // Смещение от грани/ребра наружу (равно половине толщины зоны) 
    

    // Материал для зон (делаем его невидимым в финальной версии)
    const zoneMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff, // Цвет для отладки (бирюзовый)
        wireframe: true, // Показываем каркас для отладки
        transparent: true,
        opacity: 0.5, // Делаем полупрозрачным для отладки
        visible: true, // Установите true для отладки, false для продакшена
        side: THREE.DoubleSide
    });

    // Определяем ребра и связанные с ними свойства
    // Для каждого ребра:
    // - fixedCoords: координаты, которые остаются постоянными на этом ребре (будут +/- halfSize)
    // - edgeAxis: ось, вдоль которой идет ребро ('x', 'y', или 'z')
    // - outwardDir: вектор, указывающий наружу от центра кубика через это ребро
    // - triggeredFace: грань, вращение которой запускается этим ребром (по свайпу в направлении outwardDir)
    const edges = [
        // Ребра вдоль оси Y (фиксированные X, Z) - запускают вращение R/L (вокруг X)
        { fixedX: halfSize, fixedZ: halfSize, edgeAxis: 'y', outwardDir: new THREE.Vector3(1, 0, 1), triggeredFace: 'right' }, // F-R (стрелки +X -> R)
        { fixedX: halfSize, fixedZ: -halfSize, edgeAxis: 'y', outwardDir: new THREE.Vector3(1, 0, -1), triggeredFace: 'right' }, // B-R (стрелки +X -> R)
        { fixedX: -halfSize, fixedZ: halfSize, edgeAxis: 'y', outwardDir: new THREE.Vector3(-1, 0, 1), triggeredFace: 'left' }, // F-L (стрелки -X -> L)
        { fixedX: -halfSize, fixedZ: -halfSize, edgeAxis: 'y', outwardDir: new THREE.Vector3(-1, 0, -1), triggeredFace: 'left' }, // B-L (стрелки -X -> L)

        // Ребра вдоль оси X (фиксированные Y, Z) - запускают вращение U/D (вокруг Y)
        { fixedY: halfSize, fixedZ: halfSize, edgeAxis: 'x', outwardDir: new THREE.Vector3(0, 1, 1), triggeredFace: 'up' }, // F-T (стрелки +Y -> U)
        { fixedY: -halfSize, fixedZ: halfSize, edgeAxis: 'x', outwardDir: new THREE.Vector3(0, -1, 1), triggeredFace: 'down' }, // F-Btm (стрелки -Y -> D)
        { fixedY: halfSize, fixedZ: -halfSize, edgeAxis: 'x', outwardDir: new THREE.Vector3(0, 1, -1), triggeredFace: 'up' }, // B-T (стрелки +Y -> U)
        { fixedY: -halfSize, fixedZ: -halfSize, edgeAxis: 'x', outwardDir: new THREE.Vector3(0, -1, -1), triggeredFace: 'down' }, // B-Btm (стрелки -Y -> D)

        // Ребра вдоль оси Z (фиксированные X, Y) - запускают вращение R/L (вокруг X) по изображению
        { fixedX: halfSize, fixedY: halfSize, edgeAxis: 'z', outwardDir: new THREE.Vector3(1, 1, 0), triggeredFace: 'right' }, // T-R (стрелки +X -> R)
        { fixedX: -halfSize, fixedY: halfSize, edgeAxis: 'z', outwardDir: new THREE.Vector3(-1, 1, 0), triggeredFace: 'left' }, // T-L (стрелки -X -> L)
        { fixedX: halfSize, fixedY: -halfSize, edgeAxis: 'z', outwardDir: new THREE.Vector3(1, -1, 0), triggeredFace: 'right' }, // Btm-R (стрелки +X -> R)
        { fixedX: -halfSize, fixedY: -halfSize, edgeAxis: 'z', outwardDir: new THREE.Vector3(-1, -1, 0), triggeredFace: 'left' }, // Btm-L (стрелки -X -> L)
    ];

    // Геометрия зоны (ширина, высота, глубина).
    // Ширина и высота примерно равны зоне вдоль ребра, глубина - толщина.
    const zoneGeometry = new THREE.BoxGeometry(zoneSize, zoneSize, zoneThickness); // width, height, depth

    edges.forEach(edge => {
        const outwardVector = edge.outwardDir.clone().normalize(); // Нормализованный вектор наружу

        layerPositions.forEach((layerPos, index) => { // Используем новые layerPositions
            const zone = new THREE.Mesh(zoneGeometry, zoneMaterial);
            
            const yOffset = 5;
            // Вычисляем позицию зоны
            const position = new THREE.Vector3();
            if (edge.edgeAxis === 'y') {
                position.set(edge.fixedX, layerPos + yOffset, edge.fixedZ);
            } else if (edge.edgeAxis === 'x') {
                position.set(layerPos, edge.fixedY + yOffset, edge.fixedZ);
            } else if (edge.edgeAxis === 'z') {
                position.set(edge.fixedX, edge.fixedY + yOffset, layerPos);
            }

            // Добавляем смещение наружу
            position.add(outwardVector.clone().multiplyScalar(zoneThickness / 2 + outwardOffset));

            zone.position.copy(position);

            // Ориентируем зону вдоль outwardVector, сохраняя прямоугольную форму
            zone.lookAt(zone.position.clone().add(outwardVector));
            zone.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI); // Корректируем ориентацию

            // Добавляем пользовательские данные для идентификации зоны
            zone.userData = {
                isTriggerZone: true,
                triggeredFace: edge.triggeredFace, // 'right', 'left', 'up', 'down', 'front', 'back'
                layerIndex: index, // 0, 1, 2 (соответствует layerPositions [2.04, 0, -2.04])
                outwardDir: outwardVector
            };

            zones.push(zone);
            console.log(`Trigger: ${edge.triggeredFace}, Layer: ${index}, Position: [${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}]`);
        });
    });

    return zones;
}