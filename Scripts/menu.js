import { showWheel, spinWheelThemes } from "./adMenager.js";
import { applyColorTheme, scrambleCube, solveCube } from "./cube.js";
import { getControlMode, updateProgressBar, getDeviceType, controls } from "./index.js";
import { applyTextures } from "./texturing.js";
import { textureManager } from "./texturing.js";

// Элементы интерфейса
const mainMenu = document.getElementById('mainMenu');
const helpModal = document.getElementById('helpModal');
const settingsModal = document.getElementById('settingsModal');
const creatorModal = document.getElementById('creatorModal');
const supportModal = document.getElementById('supportModal');
const resetButton = document.getElementById('resetBtn');
const backToMenuButton = document.getElementById('BackToMenuBtn');
const acceptStyleButton = document.getElementById('accept_style');
export const congratsModal = document.getElementById('congratsModal');
const pauseMenu = document.createElement('div');
const blurMenu = document.createElement('div');
const music = document.getElementById('background_music');
const musicBtn = document.getElementById('sound_setting');
export const selector_theme = document.getElementById('theme-select');
const selector_color_theme = document.getElementById('color-theme-select')
const mcTextPhoneEl = document.getElementById('mcTextPhone');
blurMenu.id = 'blurmenu';
pauseMenu.id = 'pause-menu';
pauseMenu.innerHTML = `
    <h2 id="pause">Пауза</h2>
    <button id="resumeBtn" class="resume">Вернуться</button>
    <button id="resetAndExitBtn" class="resetAndExit">Сбросить и выйти</button>`;

const helpTempletes = {
    'touch_move': `
        <li id="tm_text1">Двигайте пальцем по экрану - вращение грани в направлении движения</li>
        <li id="tm_text2">Движение пальца по оси X/Y - поворот по вертикали/горизонтали</li>
        <li id="tm_text3">На грани сверху управление может быть инвертировано.</li>
    `,
    'touch_trigger':`
        <li id="tt_text1">Нажать на экран и держать, навести палец точно на стрелки и отпустить - поворот грани</li>
        <li id="tt_text2">Нажать на экран и держать, навести палец на шар и отпустить - поворот передней грани</li>
        <li id="tt_text3">Стрелки - это поворот кубика полностью</li>`
    ,
    'control_arrows': `
    <li id="ca_text1">Зажать ПКМ и навести точно на стрелки - поворот грани (обрита выкл)</li>
    <li id="ca_text2">Зажать ПКМ и навести на шар - поворот передней грани (орбита выкл)</li>
    <li id="ca_text3">Стрелки на клавиатуре - это поворот кубика полностью</li>`
    ,
    'control_mouse_move': `
     <li id="cmm_text1">Зажать ПКМ и двигать мышь - вращение грани в направлении движения</li>
     <li id="cmm_text2">Движение мыши по оси X/Y - поворот по вертикали/горизонтали</li>
     <li id="cmm_text3"'>Однако на грани сверху управление инвертировано вверх = низ, низ = вверх.</li>
    `
}

updateHelpContent();
export let exitMenu = false;
let sounds = {
    PAUSED: 0,
    ONLY_MUSIC: 1,
    ONLY_SOUND: 2,
    BOTH_ON: 3
};
const sound_pic = {
    PAUSED: '🔇',
    ONLY_MUSIC: '🎼',
    ONLY_SOUND: '🔊',
    BOTH_ON: '🎶'
}
musicBtn.innerHTML = sound_pic.BOTH_ON
export let state_sounds = sounds.BOTH_ON;

document.body.appendChild(blurMenu)
document.body.appendChild(pauseMenu)

// по умолчанию меню скрыто
blurMenu.style.display = 'none';
pauseMenu.style.display = 'none';

export let gameState = {
    active: false,
    mode: null,
    startTime: 0,
    solved: false // Флаг, что кубик собран

}
export let timerInterval;
export let pausedDuration = 0; // общая длительность пауз
let pauseStart = 0; // время начала текущей паузы

export function updateFormStyle(textureValue, themeValue){
    const formStyle = document.getElementById('form_style');
    if (!formStyle) return;

    const ALLOWED_VALUES = ['default', 'cars', 'gems', 'girls'];

    switch(textureValue){
        case 'default':
            switch (themeValue) {
                case 'classic':
                    formStyle.src = 'textures/form_style/default.jpg';
                    break;
                case 'neon':
                    formStyle.src = 'textures/form_style/def_neon.jpg';
                    break;
                case 'monochrome':
                    formStyle.src = 'textures/form_style/def_monochrome.jpg';
                    break;
                default:
                    console.log('Неизвестная тема:', themeValue);
                    formStyle.src = 'textures/form_style/default.jpg';
                    break;
            }
            break;
        case 'cars':
            switch (themeValue){
                case 'classic':
                    formStyle.src = 'textures/form_style/cars.jpg';
                    break;
                case 'neon':
                    formStyle.src = 'textures/form_style/cars_neon.jpg';
                    break;
                case 'monochrome':
                    formStyle.src = 'textures/form_style/cars_monochrome.jpg';
                    break;
                case 'non_cassat':
                    formStyle.src = 'textures/form_style/cars_noncassat.jpg';
                    break
                default:
                    console.log('Неизвестная тема:', themeValue);
                    formStyle.src = 'textures/form_style/default.jpg';
                    break;
            }
            break;
        case 'gems':
            switch (themeValue){
                case 'classic':
                    formStyle.src = 'textures/form_style/gems.jpg';
                    break;
                case 'neon':
                    formStyle.src = 'textures/form_style/gems_neon.jpg';
                    break;
                case 'monochrome':
                    formStyle.src = 'textures/form_style/gems_monochrome.jpg';
                    break;
                case 'non_cassat':
                    formStyle.src = 'textures/form_style/gems_noncassat.jpg';
                    break;
                default:
                    console.log('Неизвестная тема:', themeValue);
                    formStyle.src = 'textures/form_style/default.jpg';
                    break;
            }
            break;
        case 'girls':
            switch (themeValue){
                case 'classic':
                    formStyle.src = 'textures/form_style/girls.jpg';
                    break;
                case 'neon':
                    formStyle.src = 'textures/form_style/girls_neon.jpg';
                    break;
                case 'monochrome':
                    formStyle.src = 'textures/form_style/girls_monochrome.jpg';
                    break;
                case 'non_cassat':                        
                    formStyle.src = 'textures/form_style/girls_noncassat.jpg';
                    break;
                default:
                    console.log('Неизвестная тема:', themeValue);
                    formStyle.src = 'textures/form_style/default.jpg';
                    break;
                }
                break;
    };

    if (!ALLOWED_VALUES.includes(textureValue)){
        formStyle.src = 'textures/form_style/custom.jpg';

    }
}

function updateCursorMode(){
    document.body.classList.remove('control-mouse-move');

    if (getControlMode() === 'control_mouse_move'){
        document.body.classList.add('control-mouse-move');
    }
}

export function updateHelpContent(){
    const deviceType = getDeviceType(); // Не используется в этом примере, но может быть нужна для логики
    const controlMode = getControlMode();

    const list = document.getElementById('cube-control-list');
    const title = document.getElementById('cube-control-title'); // Получаем элемент заголовка
    const mcTextsId = ['mcText4', 'mcText5', 'mcText6', 'mcText7', 'mcText8', 'mcText9'];

    mcTextsId.forEach(id => {
        const elem = document.getElementById(id);
        if (elem){
            if (deviceType === 'touch'){
                elem.style.display = 'none';
            } else {
                elem.style.display = 'list-item';
            }
        }
    })

    // Получаем базовый перевод "Управление кубиком" из глобальной функции t
    // Предположим, в translations.js у вас есть ключ 'cube_control_base'
    let baseTitle = window.t('cube_control_base'); // Используем глобальную функцию
    // console.warn(`baseT: ${baseTitle}`)

    // помощь для телефона
    if (mcTextPhoneEl) {
        if (deviceType === 'touch') {
            mcTextPhoneEl.innerHTML = window.t('mcTextPhone');
            mcTextPhoneEl.style.display = 'list-item';
        } else {
            mcTextPhoneEl.style.display = 'none';
        }
    }

    let templateKey; // шаблон подсказки

    switch (controlMode){
        case 'control_arrows':
            // title.textContent = '🕹Управление кубиком (стрелки)🕹'; // БЫЛО
            title.textContent = '🕹' + baseTitle + window.t('control_suffix_arrows') + '🕹'; // СТАЛО
            templateKey = 'control_arrows';
            break;
        case 'control_mouse_move':
            // title.textContent = '🕹Управление кубиком (мышь)🕹'; // БЫЛО
            title.textContent = '🕹' + baseTitle + window.t('control_suffix_mouse_move') + '🕹'; // СТАЛО
            templateKey = 'control_mouse_move';
            break;
        case 'control_touch_move':
            // title.textContent = '🕹Управление кубиком (сенсор)🕹'; // БЫЛО
            title.textContent = '🕹' + baseTitle + window.t('control_suffix_touch_move') + '🕹'; // СТАЛО
            templateKey = 'touch_move';
            break;
        case 'control_touch_trigger':
            // title.textContent = '🕹Управление кубиком (сенсор-стрелки)🕹' // БЫЛО
            title.textContent = '🕹' + baseTitle + window.t('control_suffix_touch_trigger') + '🕹'; // СТАЛО
            templateKey = 'touch_trigger';
            break;
        default:
            // title.textContent = '🕹Управление кубиком (неизвестно)🕹'; // БЫЛО
            title.textContent = '🕹' + baseTitle + window.t('control_suffix_unknown') + '🕹'; // СТАЛО (добавьте control_suffix_unknown в translations)
    }
    
    list.innerHTML = helpTempletes[templateKey] || 'Инструкции не доступны. / error';
}

window.updateHelpContent = updateHelpContent;

function updateSliderValue(rangeId, labelId){
    const range = document.getElementById(rangeId);
    const label = document.getElementById(labelId);

    range.addEventListener('input', function(){
        const volume = this.value / 100;
        if (rangeId === 'music_range'){
            music.volume = volume;
            
        }        
        label.textContent = this.value + '%';
    })
}

updateSliderValue('music_range', 'prog_music')
updateSliderValue('sound_range', 'prog_sound')

export function updateSettingTitle(){
    const settingsInfoElement = document.getElementById('settings-info');
    if (!settingsInfoElement) {console.warn("Элемент #settings-info не найден для обновления заголовка."); return;}

    const isTouchDevice = navigator.maxTouchPoints > 0;

    const emojiDev = isTouchDevice ? '📱' : '💻';

    settingsInfoElement.textContent = `${window.t('settings-info')} ${emojiDev}`
}

function resetGame() {
    if (gameState.active) {
        console.log("Сброс игры");
        stopTimer();
        updateProgressBar(0);
        gameState.active = false;
        gameState.solved = false;

        // Очищаем стрелки
        const arrows = document.querySelectorAll('.arrow');
        arrows.forEach(arrow => arrow.remove());

        // Перемешиваем кубик снова
        setTimeout(() => {
            scrambleCube(20);
            gameState.active = true;
            startGameTimer();
        }, 300);
    }
}

// Возврат в главное меню
function goToMainMenu() {
    console.log("Возвращаемся в главное меню");

    stopTimer();
    updateProgressBar(0);
    gameState.active = false;
    gameState.mode = null;
    exitMenu = false;

    // Скрываем всё, кроме главного меню
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    mainMenu.style.display = 'flex';

    // Очищаем состояние кубика
    congratsModal.style.display = 'none';
    blurMenu.style.display = 'none';
}

// Функции управления модалками
function showModal(modal){
    if (modal){
        // Скрываем все модалки перед показом новой
        document.querySelectorAll(['.modal', '.modal_set']).forEach(m => m.style.display = 'none');
        modal.style.display = 'block';       
    }
}

function hideModals() {
    document.querySelectorAll(['.modal','.modal_set','.wheel-container']).forEach(m => m.style.display = 'none');
}

function hideModalWF(){
    document.querySelectorAll('.wheel-container').forEach(wc => wc.style.display = 'none');
}

// Обработчики кнопок главного меню
document.getElementById('normalMode').addEventListener('click', () => {
    gameState.active = true
    gameState.mode = 'normal';
    gameState.solved = false
    mainMenu.style.display = 'none';
    startGameTimer();
    scrambleCube(20);
});

document.getElementById('freeMode').addEventListener('click', () => {
    gameState.active = true
    gameState.mode = 'free';
    mainMenu.style.display = 'none';
    startGameTimer();
});

// document.getElementById('trainingMode').addEventListener('click', ()=> {
//     alert('🛠Пока в разработке🛠')
// })

// Кнопка "Сброс"
if (resetButton) {
    resetButton.addEventListener('click', () => {
        if (confirm("Вы действительно хотите начать игру заново?")) {
            gameState.active = true;
            congratsModal.style.display = 'none';
            resetGame();
        }
    });
}

// Кнопка "В меню"
if (backToMenuButton) {
    backToMenuButton.addEventListener('click', () => {
        goToMainMenu();
    });
}

if (selector_color_theme){
    selector_color_theme.addEventListener('change', ()=> {
        const selectedTheme = selector_color_theme.value;       
        try {
            applyColorTheme(selectedTheme);
            console.log(`Цветовая схема "${selectedTheme}" применена через меню.`);

            updateFormStyle(selector_theme.value, selectedTheme)
        } catch (error){
            console.error("Ошибка применения цветовой темы: ", error)
        }    
    })
} else {
    console.warn('Элемент выбора цветовой темы не найден в DOM.');
    // Если элемента нет, можно создать его программно или убедиться, что он есть в HTML
}

// Обработчики для кнопок "Помощь" и "Создатель"
document.getElementById('viewWheelFortune').addEventListener('click', showWheel)
document.getElementById('helpBtn').addEventListener('click', () => showModal(helpModal));
document.getElementById('creatorBtn').addEventListener('click', () => showModal(creatorModal));
document.getElementById('supportBtn').addEventListener('click', () => showModal(supportModal));
document.getElementById('settingsBtn').addEventListener('click', () => {
    showModal(settingsModal)
    updateSettingTitle();
});
document.getElementById('sound_setting').addEventListener('click', () => {
    state_sounds = (state_sounds + 1) % 4;
    switch(state_sounds){
        case sounds.PAUSED:
            musicBtn.innerHTML = sound_pic.PAUSED;
            music.pause();
            break;
        case sounds.ONLY_MUSIC:
            musicBtn.innerHTML = sound_pic.ONLY_MUSIC;
            music.play().catch(e => console.error('Ошибка воиспроизведения: ', e));
            break;
        case sounds.ONLY_SOUND:
            musicBtn.innerHTML = sound_pic.ONLY_SOUND;
            music.pause();           
            break;           
        case sounds.BOTH_ON:
            musicBtn.innerHTML = sound_pic.BOTH_ON;
            music.play().catch(e => console.error('Ошибка воиспроизведения: ', e));
            break;
    }
})

selector_theme.addEventListener('change', async () => {
    const theme = selector_theme.value;
    try {
        await applyTextures(theme, selector_theme, selector_color_theme);
        console.log(`Текстуры "${theme}" успешно применены`);
        updateFormStyle(theme, selector_color_theme.value)
    } catch (error) {
        console.error('Ошибка применения текстур:', error);
    }
});

acceptStyleButton.addEventListener('click', async () => {
    const theme = selector_theme.value;
    try {
        await applyTextures(theme);
        alert(`Тема "${theme}" применена!`);
    } catch (error) {
        console.error('Ошибка применения текстур:', error);
    }
});

document.getElementById('theme-select_2').addEventListener('change', () => {
    updateCursorMode()
    updateHelpContent()
    // const mode = document.getElementById('theme-select_2').value;
    // localStorage.setItem('')
})

document.getElementById('resetAndExitBtn').addEventListener('click', () => {
    exitMenu = true
    pauseMenu.style.display = 'none'
    solveCube().then(() => {
        goToMainMenu();
    })
});

document.getElementById('resumeBtn').addEventListener('click', () => {
    togglePauseMenu(); // закрытие меню
})

// Общий обработчик закрытия для всех модалок
document.querySelectorAll(['.close-btn', '.close-btnWF']).forEach(btn => {
    if (btn.className === 'close-btn'){
        btn.addEventListener('click', hideModals);
    } else if (btn.className === 'close-btnWF') {
        btn.addEventListener('click', hideModalWF);
    }
});

// Закрытие по клику вне окна
window.addEventListener('click', (event) => {
    if ((event.target.classList.contains('modal') || event.target.classList.contains('modal_set')) && !event.target.closest('#pause-menu')) {
        hideModals();
    }
});

// Закрытие по ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        hideModals();
    } else if (event.code === 'KeyP'){
        console.log('подменю')
        togglePauseMenu();
    }
});

// Функция для переключения видимости подменю
export function togglePauseMenu(){
    const isPause = pauseMenu.style.display === 'block';
    pauseMenu.style.display = isPause ? 'none' : 'block';
    blurMenu.style.display = isPause ? 'none' : 'block';   
    if (!isPause){
        pauseStart = Date.now(); // Запоминаем время начала паузы
        stopTimer(); // Останавливаем таймер при паузе        
    } else {
        const pauseTime = Date.now() - pauseStart; // Длительность текущей паузы
        pausedDuration += pauseTime; // Добавляем к общему времени пауз
        startGameTimer(true); // Возобновляем таймер без сброса времени
    }
}

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

// Таймер игры
function startGameTimer(resume = false) {
    if (timerInterval) clearInterval(timerInterval); // Удаляем старый интервал
    if (!resume){
        gameState.startTime = Date.now(); // Сброс времени при новой игре
        pausedDuration = 0; // Сбрасываем накопленную паузу
    }
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - gameState.startTime - pausedDuration;
        document.getElementById('solveTime').textContent = formatTime(elapsed)
    }, 100);
}

export function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// компакт меню помощь ИИ
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

// Быстрые пресеты звука
function initSoundPresets() {
    document.querySelectorAll('.sound-preset').forEach(preset => {
        preset.addEventListener('click', () => {
            const volume = parseInt(preset.getAttribute('data-volume'));
            
            // Устанавливаем громкость музыки
            document.getElementById('music_range').value = volume;
            music.volume = volume / 100;
            document.getElementById('prog_music').textContent = `${volume}%`;
            
            // Устанавливаем громкость звуков
            document.getElementById('sound_range').value = volume;
            document.getElementById('prog_sound').textContent = `${volume}%`;
            
            // Визуальная обратная связь
            preset.style.background = 'rgba(52, 152, 219, 0.6)';
            setTimeout(() => {
                preset.style.background = '';
            }, 300);
        });
    });
}

// Обновление статистики
function updateSettingsStats() {
    // Количество разблокированных тем
    const unlockedCount = Object.keys(textureManager.configTheme)
        .filter(key => key.startsWith('custom_')).length;
    document.getElementById('unlocked-count').textContent = unlockedCount;
    
    // Количество тем в колесе
    document.getElementById('wheel-count').textContent = spinWheelThemes.length;
    
    // Текущий режим управления
    const controlMode = document.getElementById('theme-select_2').value;
    const controlNames = {
        'control_arrows': 'Стрелки',
        'control_mouse_move': 'Мышь',
        'control_touch_move': 'Сенсор',
        'control_touch_trigger': 'Триггеры'
    };
    // document.getElementById('current-control-mode').textContent = 
    //     controlNames[controlMode] || 'Неизвестно';
}

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
    showModal(helpModal);
});

// Обновляем статистику при открытии настроек
document.getElementById('settingsBtn')?.addEventListener('click', () => {
    setTimeout(updateSettingsStats, 100); // Ждем открытия модалки
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initSettingsTabs();
    initSoundPresets();
    
    // Обновляем статус орбиты
    const orbitStatus = document.getElementById('orbit-status');
    if (orbitStatus && controls) {
        const updateOrbitStatus = () => {
            orbitStatus.textContent = controls.enabled ? 'вкл' : 'выкл';
            orbitStatus.style.color = controls.enabled ? '#2ecc71' : '#e74c3c';
        };
        
        // Обновляем при изменении
        controls.addEventListener('change', updateOrbitStatus);
        updateOrbitStatus();
    }
});

// Очистка инфы:
// Добавьте в menu.js после инициализации элементов

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

// Функция очистки разблокированных тем
function clearCustomThemes() {
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
                
                console.log('Разблокированные темы очищены');
            } catch (error) {
                console.error('Ошибка при очистке тем:', error);
                showClearNotification('Ошибка при очистке тем', 'error');
            }
        }
    );
}

// Функция полного сброса
function clearAllData() {
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
                
                console.log('Все данные очищены');
            } catch (error) {
                console.error('Ошибка при сбросе данных:', error);
                showClearNotification('Ошибка при сбросе данных', 'error');
            }
        }
    );
}

// Функция сброса настроек по умолчанию
function resetAllSettings() {
    // Сбрасываем настройки звука
    document.getElementById('music_range').value = 50;
    document.getElementById('sound_range').value = 50;
    if (music) {
        music.volume = 0.5;
    }
    
    // Сбрасываем выбор темы
    document.getElementById('theme-select').value = 'default';
    document.getElementById('color-theme-select').value = 'classic';
    
    // Сбрасываем управление
    document.getElementById('theme-select_2').value = 'control_arrows';
    
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

// Функция для показа уведомлений
function showClearNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `clear-notification clear-notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">✕</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
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
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }
    }, 5000);
}

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
    const clearCustomThemesBtn = document.getElementById('clearCustomThemes');
    const clearAllDataBtn = document.getElementById('clearAllData');
    
    if (clearCustomThemesBtn) {
        clearCustomThemesBtn.addEventListener('click', clearCustomThemes);
    }
    
    if (clearAllDataBtn) {
        clearAllDataBtn.addEventListener('click', clearAllData);
    }
    
    console.log('Кнопки управления данными инициализированы');
});

// Экспортируем функции для использования в других модулях
export {
    clearCustomThemes,
    clearAllData,
    showClearNotification
};