// Scripts/platform/storage.js
import { isYandex } from './detect.js';

let ysdkPlayer = null;
const pendingSync = new Map();

function localSnapshot() {
    const snapshot = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // не тащим ключи Метрики в облако
        if (key.startsWith('_ym')) continue;

        const value = localStorage.getItem(key);
        snapshot[key] = trySerialize(value);
    }
    return snapshot;
}

/**
 * Инициализация. На Yandex — загружаем облачные данные
 * и МЕРЖИМ их с localStorage. На web/capacitor — no-op.
 */
export async function initStorage(ysdkInstance = null) {
    if (!isYandex() || !ysdkInstance) return;

    try {
        ysdkPlayer = await ysdkInstance.getPlayer({ scopes: false });

        // Тянем облачные данные и синхронизируем в localStorage
        const cloud = await ysdkPlayer.getData();
        const localUpdated = Number(localStorage.getItem('_lastUpdated') || 0);
        const cloudUpdated = Number(cloud._lastUpdated || 0);

        if (cloudUpdated >= localUpdated) {
            for (const [key, value] of Object.entries(cloud)) {
                if (value !== null && value !== undefined) {
                    // Cloud перезаписывает local (он свежее)
                    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                }
            }
        } else {
            await ysdkPlayer.setData(localSnapshot());
        }

        console.log('[storage] Yandex cloud synced');
    } catch (e) {
        console.warn('[storage] ysdk init failed, working with localStorage only', e);
        ysdkPlayer = null;
    }
}

// === Публичный синхронный API ===
export function getItem(key) {
    return localStorage.getItem(key);
}

export function setItem(key, value) {
    localStorage.setItem(key, value);

    // Фоновая синхронизация на Yandex (не блокирует)
    if (!ysdkPlayer) return;

    pendingSync.set(key, value)
    flushPending();    
}

export function removeItem(key) {
    localStorage.removeItem(key);
    if (!ysdkPlayer) return;

    pendingSync.set(key, null);   // ← null сигнализирует «удалить»
    flushPending();
}

export function clearStorage() {
    localStorage.clear();
}

function trySerialize(value) {
    if (value === null) return null;                  // ← для removeItem
    if (typeof value !== 'string') return value;
    try {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'object' && parsed !== null) return parsed;
    } catch { /* not JSON */ }
    return value;
}

let flushTimer = null;
function flushPending() {
    if (flushTimer) return;
    flushTimer = setTimeout(async () => {
        flushTimer = null;
        if (!ysdkPlayer || pendingSync.size === 0) return;

        const payload = {};
        for (const [k, v] of pendingSync) payload[k] = trySerialize(v);
        pendingSync.clear();

        try { await ysdkPlayer.setData(payload); }
        catch (e) { console.warn('[storage] flush failed', e); }
    }, 500);
}

// Флаш при уходе со страницы — важно!
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && pendingSync.size > 0) {
        const payload = {};
        for (const [k, v] of pendingSync) payload[k] = trySerialize(v);
        ysdkPlayer?.setData(payload).catch(() => {});
        pendingSync.clear();
    }
});

export function setJSON(key, obj) { setItem(key, JSON.stringify(obj)); }
export function getJSON(key) {
    const raw = getItem(key);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
}