// Scripts/platform/storage.js
import { isYandex } from './detect.js';
import { cLog, cWarn } from '../utils/logger.js';

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

        cLog('[storage] Yandex cloud synced');
    } catch (e) {
        cWarn('[storage] ysdk init failed, working with localStorage only', e);
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
    // 1. Собираем ключи, которые пойдут в облако (кроме Метрики)
    const keysToClear = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key.startsWith('_ym')) keysToClear.push(key);
    }

    // 2. Чистим локально
    localStorage.clear();

    // 3. Чистим облако — каждому ключу ставим null
    if (ysdkPlayer && keysToClear.length > 0) {
        const payload = {};
        for (const key of keysToClear) payload[key] = null;

        // через очередь, как обычный removeItem
        // (или напрямую, но лучше через pendingSync для консистентности)
        for (const key of keysToClear) {
            pendingSync.set(key, null);
        }
        flushPending();
    }
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
        catch (e) { cWarn('[storage] flush failed', e); }
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

/**
 * Получить текущий баланс монет игрока
 * @returns {number} Количество монет (по умолчанию 0)
 */
export function getPlayerCoins() {
    return getJSON('playerCoins') || 0;
}

/**
 * Начислить монеты игроку
 * @param {number} amount - Количество монет для начисления
 * @returns {number} Новый баланс
 */
export function addPlayerCoins(amount) {
    if (amount <= 0) return getPlayerCoins();
    
    const currentBalance = getPlayerCoins();
    const newBalance = currentBalance + amount;
    
    setJSON('playerCoins', newBalance);
    
    // Оповещаем UI об изменении баланса (чтобы обновить счётчик на экране)
    window.dispatchEvent(new CustomEvent('playerCoinsUpdated', { detail: newBalance }));
    
    cLog(`💰 Начислено ${amount} монет. Новый баланс: ${newBalance}`);
    return newBalance;
}

/**
 * Списать монеты (для будущих покупок)
 * @param {number} amount - Количество монет для списания
 * @returns {boolean} Успешно ли списание
 */
export function spendPlayerCoins(amount) {
    const currentBalance = getPlayerCoins();
    if (currentBalance >= amount) {
        const newBalance = currentBalance - amount;
        setJSON('playerCoins', newBalance);
        window.dispatchEvent(new CustomEvent('playerCoinsUpdated', { detail: newBalance }));
        cLog(`💸 Списано ${amount} монет. Новый баланс: ${newBalance}`);
        return true;
    }
    cWarn(`❌ Недостаточно монет. Требуется: ${amount}, Есть: ${currentBalance}`);
    return false;
}