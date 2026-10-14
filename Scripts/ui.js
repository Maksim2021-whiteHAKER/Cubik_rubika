// Scripts/ui.js
import { openCustomTextureModal } from "./customSettingsImage.js";
import { isCustomTextureUnlocked } from "./platform/customTexture.js";
import { updateFormStyle } from "./menu/form.js"
import { ui, game } from "./state.js";
import { stopTimer } from "./timer.js";
import { cLog, cWarn } from "./utils/logger.js";
import { textureManager } from "./texturing.js";

// функция для обновления прогресса
export function updateProgressBar(percentage){
    const progressFill = document.getElementById('progressFill');
    const progress_text = document.getElementById('progtext')
    cLog(`${percentage}%`)
    if (progressFill){
        progressFill.style.width = `${percentage}%`;       
        progress_text.style.color = '#ffff00'
        progress_text.textContent = `${Math.round(percentage)}%`       
    
        // Показываем модальное окно при достижении 100%
        if (percentage >= 100) {
            // Небольшая задержка для завершения анимации
            setTimeout(() => {
                if (ui.congratsModal && game.mode === 'normal') {
                    ui.congratsModal.style.display = 'block';
                    game.active = false;
                    stopTimer();
                }
            }, 300);
        }
    } else {
        console.error('Элементы прогресс-бара не найдены!');
    }
}

// Обновление селектора текстур
export function updateTextureSelectorOptions() {
    const selector = document.getElementById('theme-select');
    
    if (!selector) {
        cWarn('Элемент селектора текстур не найден для обновления.');
        return;
    }

    // Сохраняем текущее выбранное значение
    const currentValue = selector.value;

    // Очищаем список
    selector.innerHTML = '';

    // Добавляем бесплатные темы
    const freeThemes = [
        { value: 'default', text: 'По умолчанию / Default' },
        { value: 'cars', text: '🚗 Машины / Cars' },
        { value: 'gems', text: '💎 Драгоценности / Gems' },
        { value: 'girls', text: '🔥 Аниме / Anime' }
    ];

    freeThemes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme.value;
        option.textContent = theme.text;
        selector.appendChild(option);
    });

    // Добавляем разблокированные кастомные темы
    for (const themeId of Object.keys(textureManager.configTheme)) {
        if (themeId.startsWith('custom_')) {
            const themeData = textureManager.configTheme[themeId];
            const displayName = themeData._displayName || themeId.replace('custom_', '').replace(/_/g, ' ');
            const option = document.createElement('option');
            option.value = themeId;
            if (themeId.includes('custom_user')) option.textContent = `${displayName}`;
            else option.textContent = `⭐ ${displayName}`;
            option.dataset.custom = 'true';
            selector.appendChild(option);
        }
    }

    // Восстанавливаем выбранное значение
    if (selector.querySelector(`option[value="${currentValue}"]`)) {
        selector.value = currentValue;
    } else {
        selector.value = 'default';
    }

    const formStyle = document.getElementById('form_style');
    if (formStyle){
        const colorTheme = document.getElementById('color-theme-select').value;
        updateFormStyle(currentValue, colorTheme);
    }
}

// Функция обновления отображения монет
export function updateCurrencyDisplay(amount) {
    const coinElement = document.getElementById('currency_rub_count');
    const coinJumpper = document.querySelector('.jumpper');

    if (!coinElement && !coinJumpper) return;
    // Красивая микро-анимация "подпрыгивания" при изменении

    coinElement.innerText = amount;
    void coinJumpper.offsetWidth; 

    coinJumpper.classList.remove('jump');
    requestAnimationFrame(() => {
        coinJumpper.classList.add('jump');
    })

    setTimeout(() => {
        coinJumpper.classList.remove('jump');
    }, 200);

}

export function showBtnUpload() {
    if (isCustomTextureUnlocked()) {
        const divCustomTheme = document.getElementById('containerCustom');
        const unlockBtn = document.getElementById('unlockCustomTheme');
        
        // ✅ ЗАЩИТА ОТ ДУБЛИКАЦИИ: создаем кнопку только если её еще нет
        if (!document.getElementById('uploadThemeBtn')) {
            const btnUpload = document.createElement('button');
            btnUpload.textContent = '📥 Меню загрузки моей текстуры';
            btnUpload.id = 'uploadThemeBtn';
            btnUpload.className = 'uploadBtn';
            
            // При клике на кнопку открываем системное окно выбора файла
            btnUpload.addEventListener('click', () => {
                openCustomTextureModal()
            });

            divCustomTheme.appendChild(btnUpload);
        }
        
        if (unlockBtn) unlockBtn.style.display = 'none';
        // if (modalCustomTheme) modalCustomTheme.style.display = 'none';
    }        
}

export function updateCustomThemeUI() {
    const statusTextLocked = document.getElementById('textCustomLocked');
    const statusTextUnlocked = document.getElementById('textCustomUnlocked');

    if (!statusTextLocked && !statusTextUnlocked) return
    if (isCustomTextureUnlocked()) {
        statusTextUnlocked.style.display = 'block'
        statusTextUnlocked.classList.add('unlock')
        statusTextUnlocked.textContent = window.t('textCustomUnlocked');
    } else {
        statusTextLocked.style.display = 'block'
        statusTextUnlocked.classList.remove('unlock')
        statusTextLocked.textContent = window.t('textCustomLocked');
    }
}

export function showTimerInGame() {
    const uiTimer = document.getElementById('uiTimer');
    if (uiTimer) {
        uiTimer.style.display = 'block';
        uiTimer.textContent = '00:00:00'; // Сброс визуала
    }
}