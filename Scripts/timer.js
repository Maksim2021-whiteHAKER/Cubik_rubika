// Scripts/timer.js
import { game } from './state.js'

let timerInterval;
let pausedDuration = 0; // общая длительность пауз
let pauseStart = 0; // время начала текущей паузы

// Таймер игры
export function startGameTimer(resume = false) {
    if (timerInterval) clearInterval(timerInterval); // Удаляем старый интервал
    if (!resume){
        game.startTime = Date.now(); // Сброс времени при новой игре
        pausedDuration = 0; // Сбрасываем накопленную паузу
    }
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - game.startTime - pausedDuration;
        const solveTimeText = document.getElementById('solveTime')
        if (solveTimeText) solveTimeText.textContent = formatTime(elapsed)
    }, 100);
}

export function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

export function pauseTimer() {
    pauseStart = Date.now(); // Запоминаем время начала паузы
    stopTimer(); // Останавливаем таймер при паузе        
}

export function resumeTimer() {
    const pauseTime = Date.now() - pauseStart; // Длительность текущей паузы
    pausedDuration += pauseTime; // Добавляем к общему времени пауз
    startGameTimer(true); // Возобновляем таймер без сброса времени
}

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}
