// Scripts/menu/data.js
import { applyColorTheme } from '../cube.js';
import { applyTextures, textureManager } from '../texturing.js';
import { updateTextureSelectorOptions, loadSpinWheelFromStorage, updateWheelSegments } from '../rkUpravlenie.js';
import { cLog } from '../utils/logger.js';
import { getMusic } from './sound.js';

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
                showClearNotification('Все разблокированные темы удалены!', 'success');
                
                cLog('Разблокированные темы очищены');
            } catch (error) {
                console.error('Ошибка при очистке тем:', error);
                showClearNotification('Ошибка при очистке тем', 'error');
            }
        }
    );
}

// Функция полного сброса
export function clearAllData() {
    showConfirmationDialog(
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
                showClearNotification('Все данные сброшены! Перезагрузите страницу.', 'success');
                
                cLog('Все данные очищены');
            } catch (error) {
                console.error('Ошибка при сбросе данных:', error);
                showClearNotification('Ошибка при сбросе данных', 'error');
            }
        }
    );
}

// Функция для подтверждения действия
function showConfirmationDialog(message, onConfirm) {
    // Удаляем старый диалог, если есть
    const oldDialog = document.querySelector('.confirmation-dialog');
    if (oldDialog) {
        oldDialog.remove();
    }
    
    // Создаем диалог
    const dialog = document.createElement('div');
    dialog.className = 'confirmation-dialog';
    dialog.innerHTML = `
        <h3>⚠️ Подтверждение</h3>
        <p>${message}</p>
        <div class="confirmation-buttons">
            <button class="confirm-btn confirm-yes">Да, удалить</button>
            <button class="confirm-btn confirm-no">Отмена</button>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Добавляем оверлей
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
    `;
    document.body.appendChild(overlay);
    
    // Обработчики кнопок
    dialog.querySelector('.confirm-yes').addEventListener('click', () => {
        dialog.remove();
        overlay.remove();
        onConfirm();
    });
    
    dialog.querySelector('.confirm-no').addEventListener('click', () => {
        dialog.remove();
        overlay.remove();
    });
    
    // Закрытие по клику на оверлей
    overlay.addEventListener('click', () => {
        dialog.remove();
        overlay.remove();
    });
    
    // Закрытие по Escape
    const closeOnEscape = (e) => {
        if (e.key === 'Escape') {
            dialog.remove();
            overlay.remove();
            document.removeEventListener('keydown', closeOnEscape);
        }
    };
    document.addEventListener('keydown', closeOnEscape);
}

// Функция для показа уведомлений
export function showClearNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `clear-notification clear-notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">✕</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 23%;
        background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
    `;
    
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin: 0;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 5.5s';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }
    }, 5000);
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