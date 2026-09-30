// Scripts/platform/ads.js
import { getPlatform } from './detect.js';

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
    console.warn('[ads] no ad provider available');
    return false;
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
                    onOpen: () => console.log('[ads] ysdk rewarded open'),
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