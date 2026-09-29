// Scripts/tests/cube/raycaster.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { getCubesInLayer } from '../../cube/raycaster.js';
import { buildCube } from '../helpers/buildCube.js';
import { cube } from '../../state.js';

describe('getCubesInLayer', () => {
    beforeEach(() => buildCube());

    it('центральный слой по X — 9 кубиков', () => {
        const any = cube.objects.find(o => Math.abs(o.position.x) < 0.1);
        const { cubes, axis, coord } = getCubesInLayer(new THREE.Vector3(1, 0, 0), any);

        expect(cubes).toHaveLength(9);
        expect(axis).toBe('x');
        expect(coord).toBe(0);
        cubes.forEach(c => expect(Math.abs(c.position.x)).toBeLessThan(0.1));
    });

    it('крайний слой по Z — 9 кубиков', () => {
        const edge = cube.objects.find(o => o.position.z > 1);
        const { cubes, axis } = getCubesInLayer(new THREE.Vector3(0, 0, 1), edge);

        expect(cubes).toHaveLength(9);
        expect(axis).toBe('z');
    });

    it('объект вне кубика — пустой результат', () => {
        const ghost = new THREE.Object3D();
        ghost.position.set(100, 100, 100);
        cube.scene.add(ghost);

        const { cubes } = getCubesInLayer(new THREE.Vector3(1, 0, 0), ghost);
        expect(cubes).toHaveLength(0);
    });
});