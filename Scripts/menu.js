import { scrambleCube } from "./cube.js";
import { updateProgressBar } from "./index.js";

// Элементы интерфейса
const mainMenu = document.getElementById('mainMenu');
const helpModal = document.getElementById('helpModal');
const creatorModal = document.getElementById('creatorModal');
const resetButton = document.getElementById('resetBtn');
const backToMenuButton = document.getElementById('BackToMenuBtn')
export const congratsModal = document.getElementById('congratsModal');

export let gameState = {
    active: false,
    mode: null,
    startTime: 0,
    solved: false // Флаг, что кубик собран

}
export let timerInterval;

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

document.getElementById('trainingMode').addEventListener('click', ()=> {
    alert('🛠Пока в разработке🛠')
})

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