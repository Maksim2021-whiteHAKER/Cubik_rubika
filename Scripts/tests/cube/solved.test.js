// Scripts/tests/cube/solved.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { isCubeSolved } from '../../cube/solved.js';
import { buildCube } from '../helpers/buildCube.js';
import { cube, game } from '../../state.js';

describe('isCubeSolved', () => {
    beforeEach(() => {
        buildCube();
        game.active = false;                 // чтобы не дёргать UI
        game.selector_theme = { value: 'default' };
    });

    it('собранный куб → true', () => {
        expect(isCubeSolved()).toBe(true);
    });

    it('сдвинутая позиция → false', () => {
        cube.objects[0].position.x += 5;
        expect(isCubeSolved()).toBe(false);
    });

    it('разная длина массивов → false', () => {
        cube.staticObjects.pop();
        expect(isCubeSolved()).toBe(false);
    });

    it('debug: возвращает объект с progress и unsolvedObjects', () => {
        cube.objects[0].position.x += 5;
        const r = isCubeSolved(true);
        expect(r.isSolved).toBe(false);
        expect(r.progress).toBeLessThan(100);
        expect(r.unsolvedObjects.length).toBeGreaterThan(0);
    });
});