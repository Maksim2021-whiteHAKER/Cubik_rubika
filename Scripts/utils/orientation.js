// Scripts/orientation.js
import { isTouch } from './device.js';
import { cLog, cWarn } from './logger.js';

const isTouchDevice = isTouch();
const isYandexGames = typeof window.YaGames !== 'undefined';

/**
 * Запрашивает fullscreen + фиксирует ландшафтную ориентацию.
 * Должно вызываться ТОЛЬКО из обработчика пользовательского действия (клик).
 */
export async function lockToLandscape() {
    if (!isTouchDevice) return;                 // на ПК не нужно
    if (!screen.orientation || !screen.orientation.lock) {
        cWarn('Screen Orientation API не поддерживается — используем CSS-оверлей');
        return;
    }

    if (isYandexGames) {
        // SDK не даёт своего API для лок-ориентации, но можно проверить,
        // что платформа уже в нужной ориентации, и не дублировать запросы
        const ya = await window.YaGames.init();
        const deviceInfo = ya.getDeviceInfo?.();
        cLog('Yandex deviceInfo:', deviceInfo);
        // Ориентация в SDK не форсится — полагаемся на настройку в консоли разработчика
        return;
    }

    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        }
        await screen.orientation.lock('landscape');
        cLog('Ориентация зафиксирована: landscape');
    } catch (err) {
        // iOS Safari и часть браузеров бросают здесь NotSupportedError / SecurityError
        cWarn('lock(landscape) не сработал:', err?.name || err);
    }
}

export function unlockOrientation() {
    if (screen.orientation && screen.orientation.unlock) {
        try { screen.orientation.unlock(); } catch {}
    }
}

/**
 * Показывает/скрывает CSS-оверлей «поверните устройство».
 * Включается автоматически через matchMedia, без ручного вызова.
 */
export function initRotateOverlay(overlayEl) {
    if (!overlayEl || !isTouchDevice) return () => {};

    const mq = window.matchMedia('(orientation: portrait)');

    const update = () => {
        overlayEl.style.display = mq.matches ? 'flex' : 'none';
    };

    mq.addEventListener('change', update);
    update();

    // очистка
    return () => {
         mq.removeEventListener('change', update);
    };
}