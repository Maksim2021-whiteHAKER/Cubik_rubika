// Scripts/platform/detect.js

let cached = null;

export function getPlatform() {
    if (cached) return cached;

    // Yandex: либо SDK загружен, либо мы внутри iframe yandex.ru
    const inYandexIframe = location.hostname.includes('yandex') ||
                           document.referrer.includes('yandex');
    if (typeof window.YaGames !== 'undefined' || typeof window.ysdk !== 'undefined' || inYandexIframe) {
        cached = 'yandex';
        return cached;
    }

    if (typeof window.Capacitor !== 'undefined') { cached = 'capacitor'; return cached; }
    if (typeof window.cordova !== 'undefined') { cached = 'cordova'; return cached; }

    cached = 'web';
    return cached;
}

export const isYandex = () => getPlatform() === 'yandex';
export const isNative = () => ['capacitor', 'cordova'].includes(getPlatform());
export const isWeb = () => getPlatform() === 'web';