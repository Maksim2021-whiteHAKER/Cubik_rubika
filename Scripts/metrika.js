// Scripts/metrika.js
// Yandex.Metrika counter
(function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
    k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=106987423', 'ym');

window.ym(106987423, 'init', { ssr: true, webvisor: true, clickmap: true, ecommerce: "dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce: true, trackLinks: true });

/** Отправить цель в Метрику. */
export function reachGoal(goalName, params) {
    window.ym?.(106987423, 'reachGoal', goalName, params);
}

/** Отправить хит в Метрику (для SPA-навигации). */
export function hit(url, title) {
    window.ym?.(106987423, 'hit', url, { title });
}