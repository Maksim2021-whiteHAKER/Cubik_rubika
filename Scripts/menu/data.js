// Scripts/menu/data.js
import { applyColorTheme } from '../cube.js';
import { resetSettings } from '../platform/settingsStorage.js';
import { clearStorage, removeItem } from '../platform/storage.js';
import { resetWheelToDefault } from '../rkUpravlenie.js';
import { applyTextures } from '../texturing.js';
import { updateTextureSelectorOptions } from '../ui.js';
import { cLog } from '../utils/logger.js';
import { showConfirmationDialog } from './modals.js';
import { getMusic } from './sound.js';

const DEFAULT_DURATION = 5000;

// Функция очистки разблокированных тем
export async function clearCustomThemes() {
    const ok = await showConfirmationDialog('Вы действительно хотите удалить все разблокированные темы и пользовательские текстуры?<br>Это действие нельзя отменить.');
    if (!ok) return;

    try {
        // 1. Сбрасываем колесо к 4 стандартным темам и перерисовываем Canvas
        resetWheelToDefault();

        // 2. Очищаем пользовательскую загруженную текстуру и статус её разблокировки
        removeItem('user_custom_texture_data');
        removeItem('is_custom_texture_unlocked');
        
        // 3. Очищаем темы, выигранные в колесе (дублирующая защита)
        removeItem('unlockedCustomThemes');

        // 4. Обновляем выпадающий список в настройках
        updateTextureSelectorOptions();

        // 5. Уведомление
        notif.success('Все пользовательские темы и колесо сброшены!', 'center', 4000);
        cLog('✅ Пользовательские темы успешно очищены');

    } catch (error) {
        console.error('Ошибка при очистке тем:', error);
        notif.error('Ошибка при очистке тем', 'center', 4000);
    }
}

// Функция полного сброса
export async function clearAllData() {
    const ok = await showConfirmationDialog(
        'ВНИМАНИЕ! Вы собираетесь сбросить ВСЕ настройки и данные.<br>' +
        'Будут удалены: темы, настройки звука, управление, монеты и прогресс.<br>' +
        'Это действие нельзя отменить!'
    );
    if (!ok) return;

    try {
        // 1. Очищаем весь localStorage (включая монеты, настройки и ключи колеса)
        clearStorage();
        
        // 2. Принудительно восстанавливаем колесо, так как clearStorage его обнулил
        resetWheelToDefault();
        
        // 3. Сбрасываем настройки по умолчанию
        resetAllSettings();
        
        // 4. Показываем уведомление и перезагружаем страницу для гарантированного чистого старта
        notif.success('Все данные сброшены! Страница перезагружается...', 'center', 3000);
        cLog('🗑️ Все данные очищены, выполняется перезагрузка');
        
        setTimeout(() => {
            window.location.reload();
        }, 3000);

    } catch (error) {
        console.error('Ошибка при сбросе данных:', error);
        notif.error('Ошибка при сбросе данных', 'top-right', 4000);
    }
}

export function showClearNotification(message, type = 'info', position = 'top-right', duration = DEFAULT_DURATION) {
    const notification = document.createElement('div');
    notification.className = `clear-notification clear-notification--${type} clear-notification--${position}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification" aria-label="Закрыть">✕</button>
    `;
       
    const closeBtn = notification.querySelector('.close-notification');
    let hideTimer;
    let removeTimer;

    const close = () => {
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
        notification.classList.add('clear-notification--hiding');
        removeTimer = setTimeout(() => notification.remove(), 500);
    };

    closeBtn.addEventListener('click', close);
    document.body.appendChild(notification);
    hideTimer = setTimeout(close, duration);

    return { close };
}

// Функция сброса настроек по умолчанию
export function resetAllSettings() {
    resetSettings();
    
    const musicRange = document.getElementById('music_range');
    const soundRange = document.getElementById('sound_range');
    if (musicRange) musicRange.value = 50;
    if (soundRange) soundRange.value = 50;

    const sel = document.getElementById('control-selecter');
    if (sel) {
        const fallback = sel.querySelector("option")?.value;
        if (fallback) sel.value = fallback;
    }
    
    const music = getMusic();
    if (music) {
        music.volume = 0.5;
    }
    
    const themeSelect = document.getElementById('theme-select');
    const colorSelect = document.getElementById('color-theme-select');
    
    if (themeSelect) themeSelect.value = 'default';
    if (colorSelect) colorSelect.value = 'classic';
      
    if (typeof updateTextureSelectorOptions === 'function') {
        updateTextureSelectorOptions();
    }
    
    if (typeof applyColorTheme === 'function') {
        applyColorTheme('classic');
    }
    
    if (typeof applyTextures === 'function') {
        applyTextures('default');
    }
}

export function initDataButtons() {
    const clearCustomThemesBtn = document.getElementById('clearCustomThemes');
    const clearAllDataBtn = document.getElementById('clearAllData');
    
    if (clearCustomThemesBtn) clearCustomThemesBtn.addEventListener('click', clearCustomThemes);
    if (clearAllDataBtn) clearAllDataBtn.addEventListener('click', clearAllData);
}

export const notif = {
    info:    (msg, position, duration) => showClearNotification(msg, 'info', position, duration),
    success: (msg, position, duration) => showClearNotification(msg, 'success', position, duration),
    error:   (msg, position, duration) => showClearNotification(msg, 'error', position, duration),
    warn:    (msg, position, duration) => showClearNotification(msg, 'warn', position, duration),
};