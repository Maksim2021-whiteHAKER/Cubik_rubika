import { scrambleCube } from "./cube.js";

// Элементы интерфейса
const mainMenu = document.getElementById('mainMenu');
export const congratsModal = document.getElementById('congratsModal');
const helpModal = document.getElementById('helpModal');
const creatorModal = document.getElementById('creatorModal');

export let gameState = {
    active: false,
    mode: null,
    startTime: 0,
    solved: false // Флаг, что кубик собран

}
export let timerInterval;

// Функции управления модалками
function showModal(modal){
    if (modal){
        // Скрываем все модалки перед показом новой
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        modal.style.display = 'block';
    }
}

function hideModals() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
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
    // Инициализация свободного режима
});

// Обработчики для кнопок "Помощь" и "Создатель"
document.getElementById('helpBtn').addEventListener('click', () => showModal(helpModal));
document.getElementById('creatorBtn').addEventListener('click', () => showModal(creatorModal));

// Общий обработчик закрытия для всех модалок
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', hideModals);
});

// Закрытие по клику вне окна
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        hideModals();
    }
});

// Закрытие по ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        hideModals();
    }
});

// Таймер игры
function startGameTimer() {
    gameState.startTime = Date.now();
    timerInterval = setInterval(() => {
        document.getElementById('solveTime').textContent = 
            ((Date.now() - gameState.startTime)/1000).toFixed(1);
    }, 100);
}

export function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}