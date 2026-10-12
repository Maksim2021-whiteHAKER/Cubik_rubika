// Scripts/cube/action.js
import * as THREE from 'three'
import { cube, game } from '../state.js';
import { cLog, cWarn } from "../utils/logger.js";
import { updateProgressBar } from '../ui.js';
import { rotateLayer, rotateWholeCube } from './rotation.js';
import { isCubeSolved } from './solved.js';
import { notif } from '../menu/data.js';

let dontRepeat = false;

const CENTER_CUBES = [
    'Mid2_CENTER_W002', 'Mid4_CENTER_G004', 'Mid5_CENTER_Black005',
    'Mid6_CENTER_B006', 'Mid8_CENTER_Y008', 'R5_CENTER_R005', 'O5_CENTER_O005',
];

// Группы кубиков для кумулятивной проверки
const LAYER_1_AND_2 = [
    'Mid1_GW001', 'Mid3_WB003', 'O2_OW002', 'R2_WR002', // Ребра 1-го слоя
    'O1_GOW001', 'O3_OBW003', 'R1_GWR001', 'R3_RWB003', // Углы 1-го слоя
    'O4_GO004', 'O6_OB006', 'R4_GR004', 'R6_RB006'      // Ребра 2-го слоя
];

const YELLOW_EDGES = ['Mid7_YG007', 'Mid9_YB009', 'O8_YO008', 'R8_RY008'];
const YELLOW_CORNERS = ['O7_GYO007', 'O9_OYB009', 'R7_GRY007', 'R9_RBY009'];

const ENTIRE_CUBE = [...LAYER_1_AND_2, ...YELLOW_EDGES, ...YELLOW_CORNERS];

function checkGroupInPlace(targetNames, useQuaternion = false) {
    for (const name of targetNames) {
        const staticIndex = cube.staticObjects.findIndex(obj => obj.name === name);
        if (staticIndex === -1 || !cube.objects[staticIndex]) return false;

        const dynamicCube = cube.objects[staticIndex];
        const staticCube = cube.staticObjects[staticIndex];

        // 1. Позиция (всегда проверяем)
        const dynamicPos = new THREE.Vector3();
        dynamicCube.getWorldPosition(dynamicPos);
        const staticPos = new THREE.Vector3();
        staticCube.getWorldPosition(staticPos);

        const posTolerance = 0.01;
        const positionCorrect = 
            Math.abs(dynamicPos.x - staticPos.x) <= posTolerance &&
            Math.abs(dynamicPos.y - staticPos.y) <= posTolerance &&
            Math.abs(dynamicPos.z - staticPos.z) <= posTolerance;

        if (!positionCorrect) return false;

        // 2. Ориентация (проверяем только если нужно и это не центр)
        if (useQuaternion && !CENTER_CUBES.includes(dynamicCube.name)) {
            const dynamicQuat = dynamicCube.getWorldQuaternion(new THREE.Quaternion());
            const staticQuat = staticCube.getWorldQuaternion(new THREE.Quaternion());
            const angleDiff = dynamicQuat.angleTo(staticQuat);
            
            if (angleDiff > 0.01) { // 0.01 радиан
                return false;
            }
        }
    }
    return true;
}

export function testOnUserSolved(phaseNumber) {
    
    // ФАЗА 1-5: (Оставляем твои рабочие проверки, они уже кумулятивны)
    if (phaseNumber === 1) return checkGroupInPlace(['Mid2_CENTER_W002'], false);
    
    if (phaseNumber === 2) {
        return checkGroupInPlace(['Mid1_GW001', 'Mid3_WB003'], true) ||
        checkGroupInPlace(['O2_OW002', 'R2_WR002'], true);
    }

    if (phaseNumber === 3) {
        return checkGroupInPlace(['Mid1_GW001', 'Mid3_WB003', 'O2_OW002', 'R2_WR002'], true);
    }

    if (phaseNumber === 4) {
        const layer1 = ['Mid1_GW001', 'Mid3_WB003', 'O2_OW002', 'R2_WR002', 'O1_GOW001', 'O3_OBW003', 'R1_GWR001', 'R3_RWB003'];
        return checkGroupInPlace(layer1, true);
    }

    if (phaseNumber === 5) {
        return checkGroupInPlace(LAYER_1_AND_2, true);
    }

    // ==========================================
    // НОВЫЕ ФАЗЫ С ЗАЩИТОЙ ОТ ЧИТОВ
    // ==========================================

    // ФАЗА 6: Жёлтый крест
    // ТРЕБОВАНИЕ: Первые 2 слоя ИДЕАЛЬНО собраны (позиция + кватернион) 
    // И 4 жёлтых ребра стоят на своих местах (позиция ДА, кватернион НЕТ, т.к. они могут быть перевернуты)
    if (phaseNumber === 6) {
        const layersOk = checkGroupInPlace(LAYER_1_AND_2, true);
        const yellowEdgesOk = checkGroupInPlace(YELLOW_EDGES, false);
        
        if (layersOk && yellowEdgesOk) {
            cLog('✅ Фаза 6: Первые два слоя целы, жёлтый крест собран (ориентация не важна)!');
            return true;
        }
        return false;
    }

    // ФАЗА 7: Углы на своих местах
    // ТРЕБОВАНИЕ: Первые 2 слоя + Жёлтый крест ИДЕАЛЬНО собраны (позиция + кватернион)
    // И 4 жёлтых угла стоят между правильными центрами (позиция ДА, кватернион НЕТ, т.к. они могут быть перекручены)
    if (phaseNumber === 7) {
        const bottomAndCrossOk = checkGroupInPlace([...LAYER_1_AND_2, ...YELLOW_EDGES], true);
        const cornersPositionOk = checkGroupInPlace(YELLOW_CORNERS, false);

        if (bottomAndCrossOk && cornersPositionOk) {
            cLog('✅ Фаза 7: Крест цел, углы стоят на своих местах (ориентация не важна)!');
            return true;
        }
        return false;
    }

    // ФАЗА 8: Финальная сборка (Углы развёрнуты)
    // ТРЕБОВАНИЕ: ВЕСЬ КУБИК идеально собран (позиция + кватернион для всех 20 элементов)
    if (phaseNumber === 8) {
        const allSolved = checkGroupInPlace(ENTIRE_CUBE, true);
        if (allSolved) {
            cLog('🎉 Фаза 8: КУБИК ПОЛНОСТЬЮ СОБРАН!');
            return true;
        }
        return false;
    }

    return false;
}

export async function scrambleCube(numMoves = 20){
    if (cube.isRotating){
        cWarn(`Перемешивание не может быть выполнено, т.к сейчас кубик вращается`);
        return;
    }
    cube.isScrambling = true; // включаем перемешивание
    updateProgressBar(0)

    cube.scrambleMoves = numMoves;
    game.rewardAlreadyGiven = false;

    const axes = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 1)
    ];

    for (let i = 0; i < numMoves; i++){
        const cubeObj = cube.objects[Math.floor(Math.random() * cube.objects.length)];
        const axis = axes[Math.floor(Math.random() * axes.length)];
        const isCounterclockwise = Math.random() > 0.5;

        cLog(`Перемешивание: движение ${i+1}/${numMoves}: cube=${cubeObj.name}, axis=${axis.toArray()}, direction=${isCounterclockwise ? 'против часовой' : 'по часовой'}`)
        await rotateLayer(cubeObj, axis, isCounterclockwise);
    }
    
    if (game.mode === 'training') {
        const isWhiteCenterSolved = testOnUserSolved(1);
        
        if (isWhiteCenterSolved) {
            const white = cube.objects.find(obj => obj.name === 'Mid2_CENTER_W002');

            if (white) {
                await rotateLayer(white, new THREE.Vector3(1, 0, 0), false);
                cLog('⚠️ Белый центр был на месте — сдвинули его');
            }
        }
    }

    cLog(`Перемешивание куба завершено-успешно`)
    cube.isScrambling = false
}

function waitForRotationToFinish() {
    dontRepeat = false;
    return new Promise(resolve => {
        const check = () => {
            if (!cube.isRotating) { 
                updateProgressBar(0); 
                resolve();                 
            }
            else { 
                if (dontRepeat === false) notif.warn("Пожалуйста, подождите — пока кубик не завершит вращение.", 'top-right', 4000);
                dontRepeat = true;
                setTimeout(check, 50); 
            }
        };
        check();
    });
}

export async function solveCube() {
    if (cube.isRotating) { await waitForRotationToFinish();}           
    if (game.mode === 'normal' && game.exitMenu === false ) { notif.error("Недоступно в обычном режиме", 'center', 4500); updateProgressBar(0); return ;} 
   
    game.exitMenu === false ? notif.info("Начата сборка", 'center', 3000) : 0;

    cLog('До solveCube: history =', cube.historyrotation.length);
    const history = [...cube.historyrotation];

    // проходим по истории в обратном направлении
    for (let i = history.length - 1; i >= 0; i--){
        const move = history[i];

        if (move.type === 'layer'){
            const cubes = cube.objects.filter(obj => {
                const pos = new THREE.Vector3();
                obj.getWorldPosition(pos);
                return Math.abs(pos[move.layerAxis] - move.layerCoord) < 0.1;
            })
            // находим объект по имени
            const object = cubes.find(obj => obj.name === move.objectName) || cubes[0]
            if (!object){
                cWarn(`Объект: ${move.object} для вращения, не найден`)
                continue;
            }
            await rotateLayer(object, move.normal, !move.isCounterclockWise, { record: false}); 
        } else if (move.type === 'whole'){
            await rotateWholeCube(move.axis, !move.isCounterclockWise, { record: false})
        }
    }
    cLog('После solveCube: history =', cube.historyrotation.length);

    if (isCubeSolved()){
        cLog("Кубик собран, очищаем историю вращений");
        game.exitMenu === false ? updateProgressBar(100) : updateProgressBar(0);
        cube.historyrotation = [];
    } else {
        cWarn("Кубик не собран после выполнения истории");
    }
    cLog("Сборка кубика завершена");
}
