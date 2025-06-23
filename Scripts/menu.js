import { scrambleCube, solveCube } from "./cube.js";
import { updateProgressBar } from "./index.js";

// Элементы интерфейса
const mainMenu = document.getElementById('mainMenu');
const helpModal = document.getElementById('helpModal');
const creatorModal = document.getElementById('creatorModal');
const resetButton = document.getElementById('resetBtn');
const backToMenuButton = document.getElementById('BackToMenuBtn')
export const congratsModal = document.getElementById('congratsModal');
const pauseMenu = document.createElement('div');
const blurMenu = document.createElement('div');
blurMenu.id = 'blurmenu';
pauseMenu.id = 'pause-menu';
pauseMenu.innerHTML = `
    <h2 id="pause">Пауза</h2>
    <button id="resumeBtn" class="resume">Вернуться</button>
    <button id="resetAndExitBtn" class="resetAndExit">Сбросить и выйти</button>
`;
export let exitMenu = false;
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
    document.querySelectorAll('.modal', '.modal_set').forEach(m => m.style.display = 'none');
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

// Обработчики для кнопок "Помощь" и "Создатель"
document.getElementById('helpBtn').addEventListener('click', () => showModal(helpModal));
document.getElementById('creatorBtn').addEventListener('click', () => showModal(creatorModal));

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
    if (event.target.classList.contains('modal') && !event.target.closest('#pause-menu')) {
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