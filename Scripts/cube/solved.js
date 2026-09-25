// Scripts/cube/solved.js
import * as THREE from 'three';
import { cube, app, game } from '../state.js';
import { cLog, cWarn } from "../utils/logger.js";
import { updateProgressBar } from '../ui.js';

export function isCubeSolved(debugMode = false) {
    if (cube.objects.length !== cube.staticObjects.length) {
        cWarn(`Разная длина массивов: dynamic=${cube.objects.length}, static=${cube.staticObjects.length}`);
        const result = debugMode ? { 
            isSolved: false, 
            progress: 0,
            unsolvedObjects: [`Разная длина массивов: dynamic=${cube.objects.length}, static=${cube.staticObjects.length}`] 
        } : false;
        updateProgressBar(0);
        return result;
    }
    
    if (app.isMouseDown === true) {
        return debugMode ? { isSolved: false, progress: 0, unsolvedObjects: [] } : false;
    }

    // Список центральных кубиков, для которых игнорируем проверку кватернионов
    const centerCubes = [
        'Mid2_CENTER_W002',
        'Mid4_CENTER_G004',
        'Mid5_CENTER_Black005',
        'Mid6_CENTER_B006',
        'Mid8_CENTER_Y008',
        'R5_CENTER_R005',
        'O5_CENTER_O005',
    ];  

    let correctCubes = 0;
    let isSolved = true;
    const unsolvedObjects = [];
    const isDefaultTheme = game.selector_theme?.value === 'default'

    cube.objects.forEach((dynamicCube, index) => {
        const staticCube = cube.staticObjects[index];

        // Проверка имени
        if (dynamicCube.name !== staticCube.name) {
            cWarn(`Имена не совпадают: dynamic=${dynamicCube.name}, static=${staticCube.name} на индексе ${index}`);
            isSolved = false;
            unsolvedObjects.push(`Имена не совпадают: dynamic=${dynamicCube.name}, static=${staticCube.name}`);
            return;
        }

        // Проверка позиций
        const dynamicPos = new THREE.Vector3();
        dynamicCube.getWorldPosition(dynamicPos);
        const staticPos = new THREE.Vector3();
        staticCube.getWorldPosition(staticPos);

        const posTolerance = 0.01;
        const positionCorrect = 
            Math.abs(dynamicPos.x - staticPos.x) <= posTolerance &&
            Math.abs(dynamicPos.y - staticPos.y) <= posTolerance &&
            Math.abs(dynamicPos.z - staticPos.z) <= posTolerance;

        if (!positionCorrect) {
            isSolved = false;
            unsolvedObjects.push(`Позиции не совпадают для ${dynamicCube.name}: Dynamic=[${dynamicPos.x.toFixed(3)}, ${dynamicPos.y.toFixed(3)}, ${dynamicPos.z.toFixed(3)}], Static=[${staticPos.x.toFixed(3)}, ${staticPos.y.toFixed(3)}, ${staticPos.z.toFixed(3)}]`);
        }

        // Проверка кватернионов
        let orientationCorrect = true;
        if (!centerCubes.includes(dynamicCube.name) || (centerCubes.includes(dynamicCube.name) && !isDefaultTheme)) {
            const dynamicQuat = dynamicCube.getWorldQuaternion(new THREE.Quaternion());
            const staticQuat = staticCube.getWorldQuaternion(new THREE.Quaternion());
            const angleTolerance = 0.01; // Радианы
            const angleDiff = dynamicQuat.angleTo(staticQuat);
            orientationCorrect = angleDiff <= angleTolerance;
            
            if (!orientationCorrect) {
                isSolved = false;
                unsolvedObjects.push(`Кватернионы не совпадают для ${dynamicCube.name}: Dynamic=[${dynamicQuat.x.toFixed(3)}, ${dynamicQuat.y.toFixed(3)}, ${dynamicQuat.z.toFixed(3)}, ${dynamicQuat.w.toFixed(3)}], Static=[${staticQuat.x.toFixed(3)}, ${staticQuat.y.toFixed(3)}, ${staticQuat.z.toFixed(3)}, ${staticQuat.w.toFixed(3)}]`);
            }
        }

        // Проверка количества дочерних объектов
        if (dynamicCube.children.length !== staticCube.children.length) {
            cWarn(`Разное количество дочерних объектов для ${dynamicCube.name}: dynamic=${dynamicCube.children.length}, static=${staticCube.children.length}`);
            isSolved = false;
            unsolvedObjects.push(`Разное количество дочерних объектов для ${dynamicCube.name}: dynamic=${dynamicCube.children.length}, static=${staticCube.children.length}`);
        }

        // Кубик считается правильным только если и позиция и ориентация правильные
        if (positionCorrect && orientationCorrect) {
            correctCubes++;
        }
    });

    // вычисление процента %
    const totalCubes = cube.objects.length;
    const progressPercentage = totalCubes > 0 ? (correctCubes / totalCubes) * 100 : 0;

    cLog(`Прогресс: ${correctCubes}/${totalCubes} кубиков правильно (${progressPercentage.toFixed(2)}%)`);

    if (isSolved) {
        cLog('✅ Кубик собран по позициям и кватернионам!');
    } else {
        // cWarn('❌ Кубик не собран.');
    }

    // Обновляем прогресс-бар только если игра активна и не идет перемешивание
    if (!cube.isScrambling && game.active) {
        updateProgressBar(progressPercentage);
    }

    return debugMode ? { 
        isSolved, 
        progress: progressPercentage,
        unsolvedObjects 
    } : isSolved;
}

export function checkCubeSolved(){
    return isCubeSolved()
}

export function debugCheckCube() {
    const result = isCubeSolved(true);
    // const result = compareModels(cube.objects, cube.staticObjects); // true — возвращает подробный результат
    cLog('test: ', result.isSolved)
    if (result.isSolved) {
        cLog('✅ Куб собран!');
        alert('✅ Куб собран!');
    } else {
        cWarn('❌ Куб НЕ собран:');
        cWarn(result.unsolvedObjects);
        alert(`❌ Куб НЕ собран:\n${result.unsolvedObjects.join('\n')}`);
    }
}