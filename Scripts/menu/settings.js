// Scripts/menu/settings.js
import { spinWheelThemes } from '../rkUpravlenie.js';
import { textureManager, applyTextures } from '../texturing.js';
import { resetAllSettings, showClearNotification } from './data.js';
import { showModal } from './modals.js';
import { updateFormStyle } from './form.js';
import { applyColorTheme } from '../cube.js';

export function initSettings() {
    initSettingsTabs();
    initThemeSelectors();

    document.getElementById('settingsBtn')?.addEventListener('click', () => {
        setTimeout(updateSettingsStats, 100); // Ждем открытия модалки
    });

    // Кнопка сброса настроек
    document.getElementById('reset-settings')?.addEventListener('click', () => {
        if (confirm('Сбросить все настройки к значениям по умолчанию?')) {
            resetAllSettings();
            updateSettingsStats();
            showClearNotification('Настройки сброшены', 'success');
        }
    });

    // Кнопка быстрой помощи
    document.getElementById('quick-help')?.addEventListener('click', () => {
        const helpModal = document.getElementById('helpModal');
        if (helpModal) showModal(helpModal);
    });
}

function initThemeSelectors() {
    const themeSelect = document.getElementById('theme-select');
    const colorSelect = document.getElementById('color-theme-select');
    const acceptStyleBtn = document.getElementById('accept_style');

    if (themeSelect && colorSelect) {
        themeSelect.addEventListener('change', async () => {
            try {
                await applyTextures(themeSelect.value, themeSelect, colorSelect);
                updateFormStyle(themeSelect.value, colorSelect.value);
            } catch (e) { console.error(e); }
        });
    }

    // цветовая схема — этот обработчик был потерян
    if (colorSelect && themeSelect) {
        colorSelect.addEventListener('change', () => {
            try {
                applyColorTheme(colorSelect.value);
                updateFormStyle(themeSelect.value, colorSelect.value);
            } catch (e) { console.error(e); }
        });
    }

    // кнопка "Применить" (в HTML скрыта, но пусть будет)
    if (acceptStyleBtn && themeSelect) {
        acceptStyleBtn.addEventListener('click', async () => {
            try {
                await applyTextures(themeSelect.value);
                alert(`Тема "${themeSelect.value}" применена!`);
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