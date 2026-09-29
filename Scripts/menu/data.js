// Scripts/menu/data.js
import { applyColorTheme } from '../cube.js';
import { applyTextures, textureManager } from '../texturing.js';
import { updateTextureSelectorOptions, loadSpinWheelFromStorage, updateWheelSegments } from '../rkUpravlenie.js';
import { cLog } from '../utils/logger.js';
import { getMusic } from './sound.js';
import { showConfirmationDialog } from './modals.js';

const DEFAULT_DURATION = 5000;

// Функция очистки разблокированных тем
export function clearCustomThemes() {
    showConfirmationDialog(
        'Вы действительно хотите удалить все разблокированные темы?<br>Это действие нельзя отменить.',
        () => {
            try {
                // Очищаем данные в textureManager
                const customThemeKeys = Object.keys(textureManager.configTheme)
                    .filter(key => key.startsWith('custom_'));
                
                customThemeKeys.forEach(key => {
                    delete textureManager.configTheme[key];
                });
                
                // Очищаем localStorage
                localStorage.removeItem('unlockedCustomThemes');
                localStorage.removeItem('spinWheelThemes');
                
                // Восстанавливаем стандартные темы в колесе
                localStorage.setItem('spinWheelThemes', JSON.stringify([
                    {
                        id: 'beautiful',
                        name: 'Beautiful Fractal',
                        config: {
                            'front': 'textures/customCube/beautiful_Fractal_greenSide512.jpg',
                            'back': 'textures/customCube/beautiful_OpticIllusion_blueSide512.jpg',
                            'right': 'textures/customCube/beautiful_GeometryWaltz_redSide512.jpg',
                            'left': 'textures/customCube/beautiful_Waves_orangeSide512.jpg',
                            'top': 'textures/customCube/beautiful_zigzagi_whiteSide512.jpg',
                            'bottom': 'textures/customCube/beautiful_cell_yellowSide512.jpg',
                        },
                        rarity: 'rare',
                        color: '#e74c3c'
                    },
                    {
                        id: 'greatTree',
                        name: 'Great Tree',
                        config: {
                            'front': 'textures/customCube/greatTree_Iggdrasil_greenSide512.jpg',
                            'back': 'textures/customCube/greatTree_GrowingTree_blueSide512.jpg',
                            'right': 'textures/customCube/greatTree_Bloodforest_redSide512.jpg',
                            'left': 'textures/customCube/greatTree_SpaceTree_orangeSide512.jpg',
                            'top': 'textures/customCube/greatTree_WinterTree_whiteSide512.jpg',
                            'bottom': 'textures/customCube/greatTree_AutumnTree_yellowSide512.jpg',
                        },
                        rarity: 'rare',
                        color: '#2ecc71'
                    },
                    {
                        id: 'mems',
                        name: 'Memes',
                        config: {
                            'front': 'textures/customCube/mems_FrogPepe_greenSide512.jpg',
                            'back': 'textures/customCube/mems_SadCat_blueSide512.jpg',
                            'right': 'textures/customCube/mems_blyaa_redSide512.jpg',
                            'left': 'textures/customCube/mems_Doge_orangeSide512.jpg',
                            'top': 'textures/customCube/mems_Trololo_whiteSide512.jpg',
                            'bottom': 'textures/customCube/mems_SurpriseCat_yellowSide512.jpg',
                        },
                        rarity: 'common',
                        color: '#3498db'
                    }
                ]));
                
                // Обновляем UI
                updateTextureSelectorOptions();
                
                // Перезагружаем колесо фортуны
                if (typeof loadSpinWheelFromStorage === 'function') {
                    loadSpinWheelFromStorage();
                }
                if (typeof updateWheelSegments === 'function') {
                    updateWheelSegments();
                }
                
                // Показываем уведомление
                notif.success('Все разблокированные темы удалены!', 'center', 4000);
                
                cLog('Разблокированные темы очищены');
            } catch (error) {
                console.error('Ошибка при очистке тем:', error);
                notif.error('Ошибка при очистке тем', 'center', 4000);
            }
        }
    );
}

// Функция полного сброса
export async function clearAllData() {
    await showConfirmationDialog(
        'ВНИМАНИЕ! Вы собираетесь сбросить ВСЕ настройки и данные.<br>' +
        'Будут удалены: темы, настройки звука, управление, прогресс.<br>' +
        'Это действие нельзя отменить!',
        () => {
            try {
                // Очищаем весь localStorage
                localStorage.clear();
                
                // Сбрасываем настройки по умолчанию
                resetAllSettings();
                
                // Показываем уведомление
                notif.success('Все данные сброшены! Перезагрузите страницу.', 'center');
                
                cLog('Все данные очищены');
            } catch (error) {
                console.error('Ошибка при сбросе данных:', error);
                notif.error('Ошибка при сбросе данных', 'error', 'top-right', 4000);
            }
        }
    );
}

// Функция для показа уведомлений
export function showClearNotification(message, type = 'info', position = 'left', duration = DEFAULT_DURATION) {
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
        removeTimer = setTimeout(() => notification.remove(), 500)
    }

    closeBtn.addEventListener('click', close)
    document.body.appendChild(notification);

    hideTimer = setTimeout(close, duration);

    return { close }
}

// Функция сброса настроек по умолчанию
export function resetAllSettings() {
    // Сбрасываем настройки звука
    document.getElementById('music_range').value = 50;
    document.getElementById('sound_range').value = 50;

    const sel = document.getElementById('control-selecter');
    if (sel) {
        const fallback = sel.querySelector("option")?.value;
        if (fallback) sel.value = fallback;
    }
    
    const music = getMusic();
    if (music) {
        music.volume = 0.5;
    }
    
    // Сбрасываем выбор темы
    document.getElementById('theme-select').value = 'default';
    document.getElementById('color-theme-select').value = 'classic';
      
    // Обновляем отображение
    if (typeof updateTextureSelectorOptions === 'function') {
        updateTextureSelectorOptions();
    }
    
    // Обновляем цветовую тему
    if (typeof applyColorTheme === 'function') {
        applyColorTheme('classic');
    }
    
    // Обновляем текстурную тему
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
    success: (msg, position, duration) => showClearNotification(msg, 'success', position,  duration),
    error:   (msg, position, duration) => showClearNotification(msg, 'error', position, duration),
    warn:    (msg, position, duration) => showClearNotification(msg, 'warn', position, duration),
};