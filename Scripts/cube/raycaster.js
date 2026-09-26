// Scripts/cube/raycaster.js
import * as THREE from 'three'
import { cube, three, app } from '../state.js';

const raycaster = new THREE.Raycaster()

export function getCubesInLayer(normal, clickedObject) {
    const layerCubes = [];
    const threshold = 0.9;
    const clickedPos = new THREE.Vector3();

    clickedObject.getWorldPosition(clickedPos);
    const axis = Math.abs(normal.x) > threshold ? 'x' :
                 Math.abs(normal.y) > threshold ? 'y' : 'z';
    let layerCoord = Math.round(clickedPos[axis]);

    cube.objects.forEach(cubeObj => {
        const cubePos = new THREE.Vector3();
        cubeObj.getWorldPosition(cubePos);
        if (Math.abs(cubePos[axis] - layerCoord) < 0.1) {
            layerCubes.push(cubeObj);
        }
    });

//    cLog(`Слой по оси: ${axis}, координата: ${layerCoord}, кубиков: ${layerCubes.length}`);
    return { cubes: layerCubes, axis, coord: layerCoord };
}

export function checkFpsHit(mousePos) {
    if (app.CurrentActiveCam !== 'player') return null;
    // Используем координаты мыши вместо центра экрана
    three.cameraPlayer.updateMatrixWorld(true);

    raycaster.setFromCamera(mousePos || new THREE.Vector2(0, 0), three.cameraPlayer);
    const intersects = raycaster.intersectObjects(cube.objects, true);
    const validIntersect = intersects.find(i => 
        cube.objects.some(cubeObj => i.object.parent === cubeObj || i.object === cubeObj)
    )
    return validIntersect || null;
}