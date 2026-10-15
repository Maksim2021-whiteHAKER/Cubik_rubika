// Scripts/platform/ads.js
import { getPlatform } from './detect.js';
import { cLog, cWarn } from '../utils/logger.js';
import { notif } from '../menu/data.js';

/** Показать rewarded-видео. Возвращает true, если награда получена. */
export async function showRewarded() {
    const platform = getPlatform();

    if (platform === 'capacitor' && typeof admob !== 'undefined' && admob.rewarded) {
        return showAdMobRewarded();
    }

    if (platform === 'yandex' && window.ysdk?.adv) {
        return showYandexRewarded();
    }

    // Fallback — рекламы нет
    cWarn('[ads] no ad provider available');
    return false;
}

export function showRewardedAdForHint(stepNumber, onRewardCallback) {
    // Находим элемент фоновой музыки по ID из index.html
    const bgMusic = document.getElementById('background_music');
    const wasPlaying = bgMusic && !bgMusic.paused; // Запоминаем, играла ли она

    if (typeof window.ysdk === 'undefined' || !window.ysdk.adv) {
        cWarn('Yandex SDK не найден. Симуляция успешного просмотра рекламы.');
        onRewardCallback();
        return;
    }

    cLog(`🎬 Запрос рекламы для подсказки шага ${stepNumber}...`);
    
    window.ysdk.adv.showRewardedVideo({
        callbacks: {
            onOpen: () => {
                cLog('Реклама открыта');
                // ⏸ ПАУЗИМУ МУЗЫКУ ПРИ ОТКРЫТИИ РЕКЛАМЫ
                if (bgMusic && wasPlaying) {
                    bgMusic.pause();
                }
            },
            onRewarded: () => {
                cLog('✅ Реклама просмотрена до конца! Выдаем подсказку.');
                onRewardCallback();
            },
            onClose: () => {
                cLog('Реклама закрыта');
                // ▶️ ВОЗОБНОВЛЯЕМ МУЗЫКУ ПРИ ЗАКРЫТИИ
                if (bgMusic && wasPlaying) {
                    bgMusic.play().catch(() => {});
                }
            },
            onError: (error) => {
                cWarn('❌ Ошибка загрузки рекламы:', error);
                notif.error('Не удалось загрузить видео. Попробуйте позже.', 'center', 3000);
                // ▶️ ВОЗОБНОВЛЯЕМ МУЗЫКУ ДАЖЕ ПРИ ОШИБКЕ
                if (bgMusic && wasPlaying) {
                    bgMusic.play().catch(() => {});
                }
            }
        }
    });
}

function showAdMobRewarded() {
    return new Promise((resolve) => {
        const done = (val) => resolve(val);
        
        admob.rewarded.onRewarded = () => done(true);
        admob.rewarded.onAdClosed = () => done(false);
        admob.rewarded.onAdFailedToLoad = () => done(false);
        setTimeout(() => done(false), 30000);

        admob.rewarded.show().catch((e) => {
            console.error('[ads] admob error', e);
            done(false);
        });
    });
}

function showYandexRewarded() {
    return new Promise((resolve) => {
        let rewarded = false;
        try {
            window.ysdk.adv.showRewardedVideo({
                callbacks: {
                    onOpen: () => cLog('[ads] ysdk rewarded open'),
                    onRewarded: () => { rewarded = true; },
                    onClose: () => resolve(rewarded),
                    onError: (e) => { console.error('[ads] ysdk error', e); resolve(false); },
                },
            });
        } catch (e) {
            console.error('[ads] ysdk exception', e);
            resolve(false);
        }
    });
}