// Scripts/tests/cube/action.test.js

import { describe, it, expect, beforeEach } from 'vitest';
import { scrambleCube, solveCube } from '../../cube/action.js';
import { isCubeSolved } from '../../cube/solved.js';
import { buildCube } from '../helpers/buildCube.js';
import { cube, game, app } from '../../state.js';

describe('scramble + solve (round-trip)', () => {
    beforeEach(() => {
        buildCube();
        game.active = false;
        game.mode = 'free';       // обходим "Недоступно в обычном режиме"
        game.exitMenu = true;     // обходим проверку exitMenu
        game.selector_theme = { value: 'default' };
        app.speedSet = 1;
    });

    it('после scramble solveCube возвращает куб в собранное состояние', async () => {
        await scrambleCube(5);
        expect(cube.historyrotation.length).toBe(5);
        expect(isCubeSolved()).toBe(false);

        await solveCube();
        expect(isCubeSolved()).toBe(true);
        expect(cube.historyrotation).toHaveLength(0);
    });

    it('scramble(0) — история пуста', async () => {
        await scrambleCube(0);
        expect(cube.historyrotation).toHaveLength(0);
        expect(isCubeSolved()).toBe(true);
    });

    it('solveCube на собранном кубе — no-op', async () => {
        await solveCube();
        expect(isCubeSolved()).toBe(true);
        expect(cube.historyrotation).toHaveLength(0);
    });
});