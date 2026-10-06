// Scripts/menu/settings.js
import { applyColorTheme } from '../cube.js';
import { unlockCustomTexture } from '../platform/customTexture.js';
import { getSettings, saveSettings } from '../platform/settingsStorage.js';
import { getPlayerCoins } from '../platform/storage.js';
import { initWheelOfFortune, spinWheelThemes } from '../rkUpravlenie.js';
import { applyTextures, textureManager } from '../texturing.js';
import { showBtnUpload, updateCustomThemeUI } from '../ui.js';
import { cLog } from '../utils/logger.js';
import { notif, resetAllSettings } from './data.js';
import { updateFormStyle } from './form.js';
import { showConfirmationDialog, showModal } from './modals.js';

export function initSettings() {
    const unlockBtn = document.getElementById('unlockCustomTheme');

    updateCustomThemeUI();    
    showBtnUpload(); // отображение разблокированой кнопки т.е их должно быть две, т.к после нажатия кнопка скрывается
    initSettingsTabs();
    initThemeSelectors();
    initWheelOfFortune();

    document.getElementById('settingsBtn')?.addEventListener('click', () => {
        setTimeout(updateSettingsStats, 100); // Ждем открытия модалки
    });

    // Кнопка сброса настроек
    document.getElementById('reset-settings')?.addEventListener('click', async () => {
        const ok = await showConfirmationDialog('Сбросить все настройки к значениям по умолчанию?');
        if (!ok) return;

        resetAllSettings();
        updateSettingsStats();
        notif.success('Настройки сброшены', 'top-right', 3000);
    });

    // Кнопка быстрой помощи
    document.getElementById('quick-help')?.addEventListener('click', () => {
        const helpModal = document.getElementById('helpModal');
        if (helpModal) showModal(helpModal);
    });

    unlockBtn?.addEventListener('click', async () => {
        const result = unlockCustomTexture();
        if (result.success) {
            notif.success(`Успешно оплачено`, 'center', 6000);
            updateCustomThemeUI();
            showBtnUpload(); // первая разблокировка
        } else {
            notif.error(`Денег мало: ${getPlayerCoins()}`, 'top-right', 5000);
        }
    });

    cLog("Настройка инициализированны")
}

function initThemeSelectors() {
    const themeSelect = document.getElementById('theme-select');
    const colorSelect = document.getElementById('color-theme-select');
    const acceptStyleBtn = document.getElementById('accept_style');
    const s = getSettings();

    // Восстанавливаем выбор
    if (s.textureTheme && themeSelect?.querySelector(`option[value="${s.textureTheme}"]`)) {
        themeSelect.value = s.textureTheme;
    }

    if (s.colorTheme && colorSelect?.querySelector(`option[value="${s.colorTheme}"]`)) {
        colorSelect.value = s.colorTheme;
    }

    if (themeSelect && colorSelect) {
        themeSelect.addEventListener('change', async () => {
            const selectedValue = themeSelect.value;
            const selectedColor = colorSelect.value;
            saveSettings({ textureTheme: selectedValue });   // ← сохраняем сразу
            try {
                await applyTextures(selectedValue, themeSelect, colorSelect);
                updateFormStyle(selectedValue, selectedColor);
            } catch (e) { console.error(e); }
        });
    }

    if (colorSelect && themeSelect) {
        colorSelect.addEventListener('change', () => {
            const selectedValue = themeSelect.value;
            const selectedColor = colorSelect.value;
            saveSettings({ colorTheme: selectedColor });     // ← сохраняем
            try {
                applyColorTheme(selectedColor);
                updateFormStyle(selectedValue, selectedColor);
            } catch (e) { console.error(e); }
        });
    }

    // Применяем сохранённое состояние после загрузки куба
    if (themeSelect && colorSelect) {
        (async () => {
            try {
                await applyTextures(themeSelect.value, themeSelect, colorSelect);
                if (colorSelect.value) applyColorTheme(colorSelect.value);
                updateFormStyle(themeSelect.value, colorSelect.value);
            } catch (e) {
                console.error('[settings] initial apply failed', e);
            }
        })();
    }

    // кнопка "Применить" (в HTML скрыта, но пусть будет)
    if (acceptStyleBtn && themeSelect) {
        acceptStyleBtn.addEventListener('click', async () => {
            try {
                await applyTextures(themeSelect.value);
                saveSettings({ textureTheme: themeSelect.value });
                notif.success(`Тема "${themeSelect.value}" применена!`, 'top-right', 3500);
            } catch (e) { console.error(e); }
        });
    }
}

// Инициализация вкладок
function initSettingsTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Убираем активный класс у всех кнопок
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            button.classList.add('active');
            
            // Скрываем все вкладки
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Показываем нужную вкладку
            const activePane = document.getElementById(`${tabId}-tab`);
            if (activePane) {
                activePane.classList.add('active');
            }
        });
    });
}

// Обновление статистики
function updateSettingsStats() {
    // Количество разблокированных тем
    const unlockedCount = Object.keys(textureManager.configTheme)
        .filter(key => key.startsWith('custom_')).length;
    const unlockedEl = document.getElementById('unlocked-count');
    const wheelEl = document.getElementById('wheel-count');
    if (unlockedEl) unlockedEl.textContent = unlockedCount;
    
    // Количество тем в колесе
    if (wheelEl) wheelEl.textContent = spinWheelThemes.length;
}