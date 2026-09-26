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
                if (dontRepeat === false) alert("Пожалуйста, подождите — пока кубик не завершит вращение.");
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
   
    game.exitMenu === false ? alert("Начата сборка") : 0;

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
