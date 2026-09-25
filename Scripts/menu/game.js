// Scripts/menu/game.js
import { getObjects, scrambleCube, solveCube } from '../cube.js';
import { pauseTimer, resumeTimer, startGameTimer, stopTimer } from '../timer.js';
import { updateProgressBar } from '../ui.js';
import { game, ui } from '../state.js';
import { lockToLandscape } from '../utils/orientation.js';
import { cLog } from '../utils/logger.js';
import { getPauseMenu, getBlurMenu } from './modals.js'

const mainMenu = document.getElementById('mainMenu');

export function initGameButtons(){
    const reset = document.getElementById('resetBtn');
    // Обработчики кнопок главного меню
    document.getElementById('normalMode').addEventListener('click', () => {
        game.active = true
        game.mode = 'normal';
        game.solved = false
        if (mainMenu) mainMenu.style.display = 'none';
        cLog(`_objectsNM: ${getObjects().length}`);
        if (getObjects().length === 27){
            scrambleCube(20);
        } else {
            const checkAndScrumble = () => {
                if (getObjects().length === 27){
                    scrambleCube(20)
                } else {
                    setTimeout(checkAndScrumble, 100)
                }
            };
            checkAndScrumble();
        }
        lockToLandscape();
        startGameTimer();
    });

    document.getElementById('freeMode').addEventListener('click', () => {
        game.active = true
        game.mode = 'free';
        mainMenu.style.display = 'none';
        startGameTimer();
        lockToLandscape()
    });

    // document.getElementById('trainingMode').addEventListener('click', ()=> {
    //     alert('🛠Пока в разработке🛠')
    // })
   
    reset?.addEventListener('click', () => {
        if (confirm("Вы действительно хотите начать игру заново?")) {
            if (ui.congratsModal) ui.congratsModal.style.display = 'none';
            resetGame();
        }
    });

    document.getElementById('BackToMenuBtn')?.addEventListener('click', goToMainMenu);
    document.getElementById('resetAndExitBtn')?.addEventListener('click', () => {
        game.exitMenu = true;
        getPauseMenu().style.display = 'none';
        getBlurMenu().classList.remove('active');
        solveCube().then(goToMainMenu);

    });
    document.getElementById('resumeBtn')?.addEventListener('click', togglePauseMenu);
}

// Функция для переключения видимости подменю
export function togglePauseMenu(){
    const pauseMenu = getPauseMenu();
    const blurMenu = getBlurMenu();
    if (!pauseMenu || !blurMenu) return;
    const isPause = pauseMenu.style.display === 'block';
    pauseMenu.style.display = isPause ? 'none' : 'block';
    blurMenu.classList.toggle('active', !isPause)    
    if (!isPause) pauseTimer();
    else resumeTimer();
}

// Возврат в главное меню
export function goToMainMenu() {
    cLog("Возвращаемся в главное меню");

    stopTimer();
    updateProgressBar(0);
    game.active = false;
    game.mode = null;
    game.exitMenu = false;

    // Скрываем всё, кроме главного меню
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    mainMenu.style.display = 'flex';

    // Очищаем состояние кубика
    if (ui.congratsModal) ui.congratsModal.style.display = 'none';
    getBlurMenu().classList.remove('active')
}

function resetGame() {
    if (game.active) {
        cLog("Сброс игры");
        stopTimer();
        updateProgressBar(0);
        game.active = false;
        game.solved = false;

        // Очищаем стрелки
        const arrows = document.querySelectorAll('.arrow');
        arrows.forEach(arrow => arrow.remove());

        // Перемешиваем кубик снова
        setTimeout(() => {
            scrambleCube(20);
            game.active = true;
            startGameTimer();
        }, 300);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyP') togglePauseMenu();    
});