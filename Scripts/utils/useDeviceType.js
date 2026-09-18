// utils/useDeviceType.js

const FORCE_KEY = 'force-device';
const VALID = ['mobile', 'tablet', 'desktop'];

function detectRealDeviceType() {
    const w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
}

function getForcedDevice() {
    // 1. URL: ?device=phone|tablet|desktop
    const urlFlag = new URLSearchParams(location.search).get('device');
    if (VALID.includes(urlFlag)) return urlFlag;

    // 2. localStorage: setForcedDevice('phone')
    try {
        const lsFlag = localStorage.getItem(FORCE_KEY);
        if (VALID.includes(lsFlag)) return lsFlag;
    } catch {} // localStorage может быть запрещён

    return null;
}

export function getDeviceType() {
    return getForcedDevice() ?? detectRealDeviceType();
}

export function setForcedDevice(type) {
    if (VALID.includes(type)) {
        localStorage.setItem(FORCE_KEY, type);
    } else {
        localStorage.removeItem(FORCE_KEY);
    }
}

export const isMobile  = () => getDeviceType() === 'mobile';
export const isTablet  = () => getDeviceType() === 'tablet';
export const isDesktop = () => getDeviceType() === 'desktop';

/**
 * Реактивная подписка на смену типа.
 * Сейчас реагирует только на resize (auto-режим).
 * Для forced-режима нужно вручную вызвать location.reload() после setForcedDevice().
 */
export function watchDeviceType(onChange) {
    const handler = () => onChange(getDeviceType());
    window.addEventListener('resize', handler);
    handler(); // сразу вызвать
    return () => window.removeEventListener('resize', handler);
}