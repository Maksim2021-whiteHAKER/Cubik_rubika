import { applyColorTheme, scrambleCube, solveCube } from "./cube.js";
import { getControlMode, updateProgressBar } from "./index.js";
import { applyTextures } from "./texturing.js";

// Элементы интерфейса
const mainMenu = document.getElementById('mainMenu');
const helpModal = document.getElementById('helpModal');
const settingsModal = document.getElementById('settingsModal');
const creatorModal = document.getElementById('creatorModal');
const resetButton = document.getElementById('resetBtn');
const backToMenuButton = document.getElementById('BackToMenuBtn');
const acceptStyleButton = document.getElementById('accept_style');
export const congratsModal = document.getElementById('congratsModal');
const pauseMenu = document.createElement('div');
const blurMenu = document.createElement('div');
const music = document.getElementById('background_music');
const musicBtn = document.getElementById('sound_setting');
const selector_theme = document.getElementById('theme-select');
const selector_color_theme = document.getElementById('color-theme-select')
blurMenu.id = 'blurmenu';
pauseMenu.id = 'pause-menu';
pauseMenu.innerHTML = `
    <h2 id="pause">Пауза</h2>
    <button id="resumeBtn" class="resume">Вернуться</button>
    <button id="resetAndExitBtn" class="resetAndExit">Сбросить и выйти</button>`;
const helpTempletes = {
    control_arrows: `
    <li>зажать ПКМ и навести точно на стрелки - поворот грани (обрита выкл)</li>
    <li>зажать ПКМ и навести на шар - поворот передней грани (орбита выкл)</li>
    <li>Стрелки на клавиатуре - это поворот кубика полностью</li>`,
    control_mouse_move: `
     <li>зажать ПКМ и двигать мышь - вращение грани в направлении движения</li>
     <li>движение мыши по оси X/Y - поворот по вертикали/горизонтали</li>
     <li id='dls'>🕹🔴однако на грани сверху управление инвертировано вверх = низ, низ = вверх.</li>
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
    PAUSED: '../textures/volume_mute.png',
    ONLY_MUSIC: '../textures/volume_only_music.png',
    ONLY_SOUND: '../textures/volume_only_sound.png',
    BOTH_ON: '../textures/volume_both.png'
}
musicBtn.style.backgroundImage = `url(${sound_pic.BOTH_ON})`
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

function updateCursorMode(){
    if (getControlMode() === 'control_mouse_move'){
        document.body.classList.add('control-mouse-move');
    } else {
        document.body.classList.remove('control-mouse-move');
        document.body.classList.remove('gragging');
    }
}

export function updateHelpContent(){
    const controlMode = getControlMode();
    const list = document.getElementById('cube-control-list')
    const title = document.getElementById('cube-control-title')
    title.textContent = controlMode === 'control_mouse_move'
        ? '🕹Управление кубиком (мышь)🕹' 
        : '🕹Управление кубиком (стрелки)🕹';
    list.innerHTML = helpTempletes[controlMode] || helpTempletes[control_arrows];
}

function updateSliderValue(rangeId, labelId){
    const range = document.getElementById(rangeId);
    const label = document.getElementById(labelId);

    range.addEventListener('input', function(){
        const volume = this.value / 100;
        if (rangeId === 'music_range'){
            music.volume = volume;
            
        }        
        label.textContent = this.value + '%'
    })
}

updateSliderValue('music_range', 'prog_music')
updateSliderValue('sound_range', 'prog_sound')

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
document.getElementById('settingsBtn').addEventListener('click', () => showModal(settingsModal));
document.getElementById('sound_setting').addEventListener('click', () => {
    state_sounds = (state_sounds + 1) % 4;
    switch(state_sounds){
        case sounds.PAUSED:
            musicBtn.style.backgroundImage = `url(${sound_pic.PAUSED})`;
            music.pause();
            break;
        case sounds.ONLY_MUSIC:
            musicBtn.style.backgroundImage = `url(${sound_pic.ONLY_MUSIC})`;
            music.play().catch(e => console.error('Ошибка воиспроизведения: ', e));
            break;
        case sounds.ONLY_SOUND:
            musicBtn.style.backgroundImage = `url(${sound_pic.ONLY_SOUND})`;
            music.pause();           
            break;           
        case sounds.BOTH_ON:
            musicBtn.style.backgroundImage = `url(${sound_pic.BOTH_ON})`;
            music.play().catch(e => console.error('Ошибка воиспроизведения: ', e));
            break;
    }
})

selector_theme.addEventListener('change', async () => {
    const theme = selector_theme.value;
    try {
        await applyTextures(theme, selector_theme, selector_color_theme);
        console.log(`Текстуры "${theme}" успешно применены`);
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