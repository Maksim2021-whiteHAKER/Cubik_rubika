// Scripts/cube/action.js
import * as THREE from 'three'
import { cube, game } from '../state.js';
import { cLog, cWarn } from "../utils/logger.js";
import { updateProgressBar } from '../ui.js';
import { rotateLayer, rotateWholeCube } from './rotation.js';
import { isCubeSolved } from './solved.js';

let dontRepeat = false;

export async function scrambleCube(numMoves = 20){
    if (cube.isRotating){
        cWarn(`Перемешивание не может быть выполнено, т.к сейчас кубик вращается`);
        return;
    }
    cube.isScrambling = true; // включаем перемешивание
    updateProgressBar(0)

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
                if (dontRepeat === false) alert("Пожалуйста, подождите — кубик завершает вращение.");
                dontRepeat = true;
                setTimeout(check, 50); 
            }
        };
        check();
    });
}

export async function solveCube() {
    if (cube.isRotating) { await waitForRotationToFinish();}           
    if (game.mode === 'normal' && game.exitMenu === false ) { alert("Недоступно в обычном режиме"); updateProgressBar(0); return ;} 

    // optimizeHistory()
    
    game.exitMenu === false ? alert("Начата сборка") : 0;
    
    // проходим по истории в обратном направлении
    for (let i = cube.historyrotation.length - 1; i>=0; i--){
        const move = cube.historyrotation[i];
        if (move.type === 'layer'){
            // находим объект по имени
            const object = cube.objects.find(obj => obj.name === move.objectName)
            if (!object){
                alert(`Объект: ${move.object} для вращения, не найден`)
            }
            await rotateLayer(object, move.normal, !move.isCounterclockWise); 
        } else if (move.type === 'whole'){
            await rotateWholeCube(move.axis, !move.isCounterclockWise)
        }
    }
    if (isCubeSolved()){
        cLog("Кубик собран, очищаем историю вращений");
        game.exitMenu === false ? updateProgressBar(100) : updateProgressBar(0);
        cube.historyrotation = [];
    } else {
        cWarn("Кубик не собран после выполнения истории");
    }
    cLog("Сборка кубика завершена");
}

// TODO планируется доработать
// function optimizeHistory() {
//     const optimized = [];
//     for (let i = 0; i < historyrotation.length; i++) {
//         const current = historyrotation[i];
//         if (optimized.length > 0) {
//             const last = optimized[optimized.length - 1];
//             if (
//                 current.type === last.type &&
//                 current.objectName === last.objectName &&
//                 current.normal.equals(last.normal) &&
//                 current.isCounterclockwise === !last.isCounterclockwise
//             ) {
//                 optimized.pop(); // Удаляем противоположные вращения
//                 continue;
//             }
//         }
//         optimized.push(current);
//     }
//     historyrotation = optimized;
//     cLog(`История оптимизирована, длина: ${historyrotation.length}`);
// }
