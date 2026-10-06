// Scripts/cube/solved.js
import * as THREE from 'three';
import { cube, app, game } from '../state.js';
import { cLog, cWarn, isDev } from "../utils/logger.js";
import { updateProgressBar } from '../ui.js';
import { analytics } from '../platform/analytics.js';
import { getElapsed } from '../timer.js';
import { notif } from '../menu/data.js';
import { addPlayerCoins } from '../platform/storage.js';

function gettingTimeReward() {
    cLog('✅ Кубик собран по позициям и кватернионам!');

    if (game.mode === 'free') {
        notif.warn("⚠ Свободный режим: награда не начисляется", 'center', 6500);
        return;
    }

    const solveTimeSeconds = Math.round(getElapsed() / 1000);

    const MIN_SCRAMBLE_MOVES = 20;
    if (cube.scrambleMoves < MIN_SCRAMBLE_MOVES) {
        cWarn('⚠️ Кубик недостаточно перемешан. Награда не начислена.');
        return;
    }

    // ✅ 1. ПРОВЕРЯЕМ ТЕМУ ПРЯМО ЗДЕСЬ (а не в начале файла)
    const currentTheme = game.selector_theme?.value;
    const isHardMode = currentTheme !== 'default';

    // ✅ 2. НАСТРАИВАЕМ ПАРАМЕТРЫ В ЗАВИСИМОСТИ ОТ РЕЖИМА
    const maxReward = isHardMode ? 500 : 100;   // 500 за хард, 100 за обычный
    const minReward = isHardMode ? 4 : 10;      // сложнее Кубик меньше минималка логично же, за то за скорость бонус выше 😈😇
    
    const maxTime = isHardMode ? 180 : 60;      // 3 минуты на максимум vs 1 минута
    const minTime = isHardMode ? 900 : 600;     // 15 минут на минимум vs 10 минут

    let rewardCoins;

    // ✅ 3. МАТЕМАТИЧЕСКИ ВЕРНЫЙ РАСЧЕТ
    if (solveTimeSeconds <= maxTime) {
        rewardCoins = maxReward; // Берем максимальную награду (100 или 500)
    } else if (solveTimeSeconds >= minTime) {
        rewardCoins = minReward; // Падаем до минимума (10)
    } else {
        // Плавное падение от maxReward до minReward
        const timeInPenalty = solveTimeSeconds - maxTime;
        const totalPenaltyTime = minTime - maxTime;
        const totalDrop = maxReward - minReward; // 490 для харда, 90 для обычного
        
        const penalty = (timeInPenalty / totalPenaltyTime) * totalDrop;
        rewardCoins = Math.round(maxReward - penalty);
    }

    // Гарантируем, что награда не меньше 10 и не больше максимума (защита от багов округления)
    rewardCoins = Math.max(minReward, Math.min(maxReward, rewardCoins));

    // 4. Начисление валюты
    const newBalance = addPlayerCoins(rewardCoins);

    // 5. Аналитика
    if (!isDev) {
        analytics.gameSolved(solveTimeSeconds, rewardCoins, currentTheme);
    }

    // 6. Красивое уведомление с акцентом на хардкор
    const modeText = isHardMode ? '🔥 ХАРДКОР / HARDCORE' : '🏆 Собрано! / Solved';
    notif.success(`${modeText}<br>+${rewardCoins} монет/coin <br>💰 Баланс/Balance: ${newBalance}`, 'center', 6000);
}

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
        gettingTimeReward();
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
    } else {
        cWarn('❌ Куб НЕ собран:');
        cWarn(result.unsolvedObjects);
    }
}