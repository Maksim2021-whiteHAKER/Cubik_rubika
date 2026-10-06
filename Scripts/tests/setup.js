// Scripts/tests/setup.js
import { vi, beforeEach } from 'vitest';

// rAF: синхронно «прыгаем» в конец анимации
// duration в rotateLayer = app.speedSet (≈300ms), поэтому +10000 заведомо > duration
globalThis.requestAnimationFrame = (cb) => {
    cb(performance.now() + 10000);
    return 0;
};
globalThis.cancelAnimationFrame = () => {};

// DOM: элемент звука ротации должен существовать
beforeEach(() => {
    document.body.innerHTML = '';
    const audio = document.createElement('audio');
    audio.id = 'rotation_sound';
    document.body.appendChild(audio);
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue();
});

vi.mock('three/examples/jsm/libs/stats.module.js', () => {
    return {
        default: class MockStats {
            constructor() {
                this.dom = document.createElement('div');
                this.begin = vi.fn();
                this.end = vi.fn();
                this.update = vi.fn();
            }
        }
    };
});

// ui.js: не трогаем реальный прогресс-бар
vi.mock('../ui.js', () => ({
    updateProgressBar: vi.fn(),
    updateTextureSelectorOptions: vi.fn()
}));

// logger: тесты не должны спамить
vi.mock('../utils/logger.js', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        cLog: vi.fn(),
        cWarn: vi.fn(),
        cError: vi.fn(),
}});

vi.mock('../rkUpravlenie.js', () => ({
    spinWheelThemes: [],
    loadSpinWheelFromStorage: vi.fn(),
    updateWheelSegments: vi.fn(),
    showWheel: vi.fn(),
    hideWheel: vi.fn(),
    initWheelOfFortune: vi.fn(),
    unlockCustomThemeViaSpin: vi.fn(),
    getSpinWheelThemes: vi.fn(() => []),
}));