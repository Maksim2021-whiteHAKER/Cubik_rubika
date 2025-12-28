import { applyColorTheme, scrambleCube, solveCube } from "./cube.js";
import { getControlMode, updateProgressBar, getDeviceType } from "./index.js";
import { applyTextures } from "./texturing.js";

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
musicBtn.style.fontSize = '20px';
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

function updateFormStyle(textureValue, themeValue){
    const formStyle = document.getElementById('form_style');
    if (!formStyle) return;

    switch(textureValue){
        case 'default':
            switch (themeValue) {
                case 'classic':
                    formStyle.src = 'textures/form_style/default.png';
                    break;
                case 'neon':
                    formStyle.src = 'textures/form_style/def_neon.png';
                    break;
                case 'monochrome':
                    formStyle.src = 'textures/form_style/def_monochrome.png';
                    break;
                default:
                    console.log('Неизвестная тема:', themeValue);
                    formStyle.src = 'textures/form_style/default.png';
                    break;
            }
            break;
        case 'cars':
            switch (themeValue){
                case 'classic':
                    formStyle.src = 'textures/form_style/cars.png';
                    break;
                case 'neon':
                    formStyle.src = 'textures/form_style/cars_neon.png';
                    break;
                case 'monochrome':
                    formStyle.src = 'textures/form_style/cars_monochrome.png';
                    break;
                case 'non_cassat':
                    formStyle.src = 'textures/form_style/cars_noncassat.png';
                    break
                default:
                    console.log('Неизвестная тема:', themeValue);
                    formStyle.src = 'textures/form_style/default.png';
                    break;
            }
            break;
        case 'gems':
            switch (themeValue){
                case 'classic':
                    formStyle.src = 'textures/form_style/gems.png';
                    break;
                case 'neon':
                    formStyle.src = 'textures/form_style/gems_neon.png';
                    break;
                case 'monochrome':
                    formStyle.src = 'textures/form_style/gems_monochrome.png';
                    break;
                case 'non_cassat':
                    formStyle.src = 'textures/form_style/gems_noncassat.png';
                    break;
                default:
                    console.log('Неизвестная тема:', themeValue);
                    formStyle.src = 'textures/form_style/default.png';
                    break;
            }
            break;
        case 'girls':
            switch (themeValue){
                case 'classic':
                    formStyle.src = 'textures/form_style/girls.png';
                    break;
                case 'neon':
                    formStyle.src = 'textures/form_style/girls_neon.png';
                    break;
                case 'monochrome':
                    formStyle.src = 'textures/form_style/girls_monochrome.png';
                    break;
                case 'non_cassat':                        
                    formStyle.src = 'textures/form_style/girls_noncassat.png';
                    break;
                default:
                    console.log('Неизвестная тема:', themeValue);
                    formStyle.src = 'textures/form_style/default.png';
                    break;
                }
                break;
    }
}

function updateCursorMode(){
    document.body.classList.remove('control-mouse-move');
    document.body.classList.remove('control-touch-move');

    if (getControlMode() === 'control_mouse_move'){
        document.body.classList.add('control-mouse-move');
    } else if (getControlMode() === 'control_touch_move'){
        document.body.classList.add('control-touch-move');
    }

}

export function updateHelpContent(){
    const deviceType = getDeviceType(); // Не используется в этом примере, но может быть нужна для логики
    const controlMode = getControlMode();

    const list = document.getElementById('cube-control-list');
    const title = document.getElementById('cube-control-title'); // Получаем элемент заголовка

    // Получаем базовый перевод "Управление кубиком" из глобальной функции t
    // Предположим, в translations.js у вас есть ключ 'cube_control_base'
    let baseTitle = window.t('cube_control_base'); // Используем глобальную функцию
    console.warn(`baseT: ${baseTitle}`)

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

    settingsInfoElement.textContent = `Настройки ${emojiDev}`
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
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        modal.style.display = 'block';       
    }
}

function hideModals() {
    document.querySelectorAll(['.modal','.modal_set']).forEach(m => m.style.display = 'none');
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
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', hideModals);
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