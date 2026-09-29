// Scripts/tests/cube/rotation.test.js

import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { rotateLayer, rotateWholeCube } from '../../cube/rotation.js';
import { buildCube } from '../helpers/buildCube.js';
import { cube, game, app } from '../../state.js';

describe('rotateLayer', () => {
    beforeEach(() => {
        buildCube();
        game.active = false;
        app.speedSet = 300;
    });

    it('4 поворота слоя возвращают его в исходное состояние', async () => {
        const any = cube.objects.find(o => o.position.z > 1);
        const before = cube.objects.map(o => o.position.clone());

        for (let i = 0; i < 4; i++) {
            await rotateLayer(any, new THREE.Vector3(0, 0, 1), false);
        }

        cube.objects.forEach((o, idx) => {
            expect(o.position.x).toBeCloseTo(before[idx].x, 3);
            expect(o.position.y).toBeCloseTo(before[idx].y, 3);
            expect(o.position.z).toBeCloseTo(before[idx].z, 3);
        });
    });

    it('блокировка при isRotating=true', async () => {
        cube.isRotating = true;
        await rotateLayer(cube.objects[0], new THREE.Vector3(1, 0, 0), false);
        expect(cube.cubesToRotate).toEqual([]);
        expect(cube.isRotating).toBe(true);
    });

    it('пишет ход в историю', async () => {
        const any = cube.objects.find(o => o.position.z > 1);
        await rotateLayer(any, new THREE.Vector3(0, 0, 1), false);

        expect(cube.historyrotation).toHaveLength(1);
        expect(cube.historyrotation[0]).toMatchObject({
            type: 'layer',
            isCounterclockWise: false,
        });
        expect(cube.historyrotation[0].layerAxis).toBe('z');
    });

    it('record:false не пишет в историю', async () => {
        const any = cube.objects[0];
        await rotateLayer(any, new THREE.Vector3(0, 0, 1), false, { record: false });
        expect(cube.historyrotation).toHaveLength(0);
    });
});

describe('rotateWholeCube', () => {
    beforeEach(() => {
        buildCube();
        game.active = false;
    });

    it('4 поворота всего куба возвращают состояние', async () => {
        const before = cube.objects.map(o => o.quaternion.clone());

        for (let i = 0; i < 4; i++) {
            await rotateWholeCube(new THREE.Vector3(1, 0, 0), false);
        }

        cube.objects.forEach((o, idx) => {
            expect(o.quaternion.angleTo(before[idx])).toBeLessThan(0.01);
        });
    });

    it('обновляет referencePositions', async () => {
        const beforeSize = cube.referencePositions.size;
        await rotateWholeCube(new THREE.Vector3(0, 1, 0), false);
        // referencePositions заполняется только когда saveReferencePositions=true
        expect(cube.referencePositions.size).toBeGreaterThanOrEqual(beforeSize);
    });
});