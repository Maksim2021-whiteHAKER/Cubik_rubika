// utils/device.js

/* ============================================================
 * ОСЬ 1. Тип ВВОДА — определяет схему управления
 * ============================================================ */
export function getInputType() {
    return navigator.maxTouchPoints > 0 ? 'touch' : 'mouse';
}
export const isTouch = () => getInputType() === 'touch';
export const isMouse = () => getInputType() === 'mouse';

/* ============================================================
 * ОСЬ 2. Класс УСТРОЙСТВА — определяет размеры UI (стрелок, шрифтов)
 * ============================================================ */
const FORCE_KEY = 'force-device';
const VALID = ['mobile', 'tablet', 'desktop'];

function detectByWidth() {
    const w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
}

function forced() {
    const url = new URLSearchParams(location.search).get('device');
    if (VALID.includes(url)) return url;
    try {
        const ls = localStorage.getItem(FORCE_KEY);
        if (VALID.includes(ls)) return ls;
    } catch {}
    return null;
}

export function getDeviceClass() {
    return forced() ?? detectByWidth();
}
export const isMobile  = () => getDeviceClass() === 'mobile';
export const isTablet  = () => getDeviceClass() === 'tablet';
export const isDesktop = () => getDeviceClass() === 'desktop';

export function setForcedDevice(type) {
    if (VALID.includes(type)) localStorage.setItem(FORCE_KEY, type);
    else localStorage.removeItem(FORCE_KEY);
}
