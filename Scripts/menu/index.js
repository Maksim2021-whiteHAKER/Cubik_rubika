// Scripts/menu/index.js
import { initDataButtons } from "./data.js";
import { initGameButtons } from "./game.js";
import { updateHelpContent, updateCursorMode } from "./help.js";
import { ensureModalContainers, initMainMenuButtons, initModalClose } from "./modals.js";
import { initSettings } from "./settings.js";
import { initSound } from "./sound.js";
import { isMobile, isTablet } from '../utils/device.js';
import { initRotateOverlay } from "../utils/orientation.js";
import { cLog } from '../utils/logger.js';

// Элементы интерфейса
window.updateHelpContent = updateHelpContent;

export function initMenu() {
    const controlSelecter = document.getElementById('control-selecter');
    ensureModalContainers();
    initModalClose();
    initMainMenuButtons();
    initSound();
    initSettings();
    initDataButtons();
    initGameButtons();
    updateHelpContent();

    const importantText = document.getElementById('importantText');

    if ((isMobile() || isTablet()) && importantText) {
        importantText.style.display = 'block'
    }

    // Управление курсором
    if (controlSelecter) {
        controlSelecter.addEventListener('change', () => {
            updateCursorMode();
            updateHelpContent();
        });
    }

    cLog("Меню инициализировано");
}

// Обновляем статистику при открытии настроек


// Добавляем стили для анимации
const clearStyles = document.createElement('style');
clearStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(clearStyles);

// Инициализация кнопок при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const rotateOverlay = document.getElementById('rotate-device-overlay');   
    if (rotateOverlay) initRotateOverlay(rotateOverlay);

});
