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

export function showRewardedAdForHint(stepNumber, onSuccessCallback) {
    // Если мы локально (нет SDK Яндекса)
    if (typeof window.ysdk === 'undefined' || !window.ysdk.adv) {
        cWarn('⚠️ Yandex SDK не найден (локальный тест).');
        
        // ⚠️ ВАЖНО: Чтобы протестировать, что кнопка НЕ разблокируется сама, 
        // ЗАКОММЕНТИРУЙ следующую строку локально:
        // onSuccessCallback(); 
        
        // А вместо неё покажи уведомление, что это работает только в Яндексе:
        notif.info('🎬 В реальной игре здесь будет реклама. (Локальный тест)', 'center', 3000);
        return;
    }

    // Реальная логика для Яндекс Игр
    cLog(`🎬 Запрос рекламы для шага ${stepNumber}...`);
    
    window.ysdk.adv.showRewardedVideo({
        callbacks: {
            onOpen: () => cLog('Реклама открыта'),
            onRewarded: () => {
                cLog('✅ Реклама просмотрена до конца! Выдаем награду.');
                onSuccessCallback(); // ⚠️ ВЫЗЫВАЕТСЯ ТОЛЬКО ЗДЕСЬ, после реального просмотра
            },
            onClose: () => cLog('Реклама закрыта пользователем'),
            onError: (error) => {
                cWarn('❌ Ошибка загрузки рекламы:', error);
                notif.error('Не удалось загрузить видео. Попробуйте позже.', 'center', 3000);
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