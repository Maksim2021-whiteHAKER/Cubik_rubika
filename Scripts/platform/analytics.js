// Scripts/platform/analytics.js
import { cLog } from '../utils/logger.js';
import { getPlatform } from './detect.js';

const METRIKA_ID = 106987423;

/** Отправить событие. */
export function track(eventName, params = {}) {
    const platform = getPlatform();

    // Метрика — работает везде, где есть ym (web, capacitor)
    if (typeof window.ym === 'function' && platform !== 'yandex') {
        try { window.ym(METRIKA_ID, 'reachGoal', eventName, params); } catch (e) {}
    }

    // Yandex SDK events (для внутренней аналитики площадки)
    if (platform === 'yandex') {
         // свои события — через player или лог
        cLog('[analytics:yandex]', eventName, params);
    }
}

/** Хит для SPA-навигации. */
export function hit(url, title) {
    if (typeof window.ym === 'function') {
        try { window.ym(METRIKA_ID, 'hit', url, { title }); } catch (e) {}
    }
}

export const analytics = {
    gameStarted: (mode) => track('game_started', { mode }),
    gameSolved: (timeMs) => track('game_solved', { time_ms: timeMs }),
    themeUnlocked: (themeId) => track('theme_unlocked', { theme_id: themeId }),
    adShown: (ok) => track('ad_shown', { success: ok }),
    wheelSpinned: () => track('wheel_spinned'),
};