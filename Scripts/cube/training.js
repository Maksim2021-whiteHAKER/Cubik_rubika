// Scripts/cube/training.js
import { cube, game } from "../state.js";
import { cLog, cWarn } from "../utils/logger.js";
import { scrambleCube, testOnUserSolved } from "./action.js";
import { addPlayerCoins } from '../platform/storage.js';
import { notif } from '../menu/data.js';
import { showRewardedAdForHint } from "../platform/ads.js";
import { t } from "../translations.js";

let isScramblingPhase = true;
let switchHide = false

const studyStepKeys = [
    'zeroMessage', 'oneMessage', 'twoMessage', 'threeMessage',
    'fourMessage', 'fiveMessage', 'sixMessage', 'sevenMessage', 'eightMessage'
];

const TOTAL_STEPS = 8; // Реальное количество шагов

const procFromStep = 100 / 8;
let progressBarCon = 0;

const convertTextInLvl = {};

for (let i = 0; i <= TOTAL_STEPS; i++) {
    convertTextInLvl[i] = `${i}/${TOTAL_STEPS}`;
}

function showWindowEndStudy(alreadyGain = false) {
    const congratsModal = document.getElementById('congratsModalEndStudy');
    if (!congratsModal) return;

    // Защита от дублирования при повторном вызове
    if (congratsModal.children.length > 0) {
        congratsModal.style.display = 'flex'; // Показываем, если уже создано
        return;
    }

    const divModalContent = document.createElement('div');
    divModalContent.className = 'modal-content';
    divModalContent.id = 'study-end';
    divModalContent.style.textAlign = 'center';

    const h2 = document.createElement('h2');
    h2.id = 'congratsEndStudy';
    h2.innerHTML = t('congratsEndStudy') || '🎉 Поздравляю с окончанием обучения! 🎉';

    const pNotGain = document.createElement('p');
    const pAlreadyGain = document.createElement('p')

    if (!alreadyGain) {
        pNotGain.id = 'textCongratsEndStudyNotGain';
        pNotGain.innerHTML = t('textCongratsEndStudyNotGain') || 'Вот обещанная награда: <strong style="color: #f1c40f; font-size: 1.2rem;">150 монет</strong> магического куба!';
    } else {
        pAlreadyGain.id = 'textCongratsEndStudyAlredyGain';
        pAlreadyGain.innerHTML = t('textCongratsEndStudyAlredyGain') || 'Вы уже получили награду, повторное получение невозможно 😎😁 но рад что вы еще раз прошли обучение';
    }

    const btnExit = document.createElement('button');
    btnExit.id = 'backToMainMenuFromStudy';
    btnExit.className = 'menu-btn'
    btnExit.innerHTML = t('backToMainMenuFromStudy') || 'Вернуться в меню';

    // Логика кнопки выхода
    btnExit.addEventListener('click', () => {
        congratsModal.style.display = 'none';
        document.getElementById('studyModal').style.display = 'none';
        document.getElementById('mainMenu').style.display = 'flex'; // Возврат в главное меню
        game.mode = null; // Сброс режима
        game.active = false;
    });

    // ✅ ПРАВИЛЬНАЯ ВЛОЖЕННОСТЬ
    divModalContent.appendChild(h2);
    alreadyGain ? divModalContent.appendChild(pAlreadyGain) : divModalContent.appendChild(pNotGain);
    divModalContent.appendChild(btnExit);
    congratsModal.appendChild(divModalContent);
    
    congratsModal.style.display = 'flex'; // ✅ ДЕЛАЕМ ОКНО ВИДИМЫМ
}

function showHintContent(step) {
    const videoModal = document.getElementById('videoHintModal');
    const videoPlayer = document.getElementById('hintVideoPlayer');
    const closeBtn = document.getElementById('closeVideoBtn');

    if (!videoModal || !videoPlayer) {
        cWarn('Элементы видео-модалки не найдены в HTML!');
        return;
    }

    const videoPath = `vdk/vdk_h_${step}.mp4`;
    
    cLog(`🎥 Загрузка видео-подсказки: ${videoPath}`);
    
    videoPlayer.src = videoPath;
    videoModal.style.display = 'flex';
    
    // Пытаемся запустить видео
    videoPlayer.play().catch(e => {
        cWarn('Автовоспроизведение заблокировано браузером. Пользователь должен нажать Play.');
    });

    // Функция безопасного закрытия
    const closeVideo = () => {
        videoPlayer.pause();
        videoPlayer.currentTime = 0; // Сброс на начало
        videoPlayer.src = ''; // Освобождаем память
        videoModal.style.display = 'none';
        
        // Удаляем слушатели, чтобы не дублировались при следующем открытии
        closeBtn.removeEventListener('click', closeVideo);
        videoModal.removeEventListener('click', handleBackdropClick);
    };

    const handleBackdropClick = (e) => {
        if (e.target === videoModal) {
            closeVideo();
        }
    };

    closeBtn.addEventListener('click', closeVideo);
    videoModal.addEventListener('click', handleBackdropClick);
}

export function checkTrainingProcess() {
    if (game.mode !== 'training') return

    const nextBtn = document.getElementById('nextBtnStudy');
    
    if (!nextBtn) return;
    
    if (game.trainingStep > 0 && isScramblingPhase === false) {
        if (testOnUserSolved(game.trainingStep)) {
            nextBtn.disabled = false;
            nextBtn.style.opacity = '1';
            cLog(` Фаза ${game.trainingStep} завершена! Кнопка разблокирована.`);
        }
        
        if (game.trainingStep === 8 && testOnUserSolved(8)) {
            nextBtn.disabled = true;
            
            const container = document.getElementById('modalStudyConytainer');
            if (container) container.style.display = 'none';

            // ✅ ПЕРВЫЙ РАЗ ЗАВЕРШАЕТ ОБУЧЕНИЕ
            if (!game.trainingComplete) {
                addPlayerCoins(150);
                game.trainingComplete = true;
                game.rewardReceived = true; // Синхронизируем состояние
                localStorage.setItem('trainingComplete', 'true');
                
                showWindowEndStudy(false); // Показываем сообщение с наградой
                notif.success('🎉 Обучение завершено! +150 монет в награду!', 'center', 5000);
            } 
            else {
                showWindowEndStudy(true); // Показываем сообщение "Вы уже получили награду 😎"
            }
        }
    }
}

export function startTrainingCource() {
    if (localStorage.getItem('trainingComplete') === 'true') {
        game.rewardReceived = true;
    }

    progressBarCon = 0;

    document.getElementById('trainingModal').style.display = 'none' 
    document.getElementById('studyModal').style.display = 'block'
    const container = document.getElementById('modalStudyConytainer')
    const backBtn = document.getElementById('backBtnStudy');
    const nextBtn = document.getElementById('nextBtnStudy');
    const videoHintBtn = document.getElementById('videoHintStudy');
    const hideModalBtn = document.getElementById('hide-modal');
    const step = document.getElementById('step-0');
    const countStep = document.getElementById('progtextStudy');

    if (typeof window.applyTranslations === 'function') {
        window.applyTranslations();
    }

    setTrainingStep(0, {countStep, backBtn, step, nextBtn})

    backBtn.disabled = true;
    videoHintBtn.disabled = true;
    videoHintBtn.style.opacity = '0.7';
    videoHintBtn.style.color = '#7812ff'
    videoHintBtn.style.fontWeight = 'bold';
    nextBtn.style.opacity = '1';

    nextBtn?.addEventListener('click', async () => {
        await backNextTransfer(true, countStep, backBtn, step, nextBtn, videoHintBtn);
    })

    backBtn?.addEventListener('click', async () => {
        await backNextTransfer(false, countStep, backBtn, step, nextBtn, videoHintBtn);
    })

    hideModalBtn?.addEventListener('click', () => {
        switchHide = !switchHide
        hideModalBtn.classList.toggle('close')
        switchHide ? container.style.display = 'none' : container.style.display = 'flex';
    })

    videoHintBtn?.addEventListener('click', () => {
        const currentStep = game.trainingStep;

        // 1. Если подсказка УЖЕ разблокирована для этого шага, просто показываем её
        if (game.unlockedHints.includes(currentStep)) {
            showHintContent(currentStep);
            return;
        }

        // 2. Если еще не смотрели, блокируем кнопку и запускаем рекламу
        videoHintBtn.disabled = true;
        videoHintBtn.textContent = '⏳ Загрузка...';

        showRewardedAdForHint(currentStep, () => {
            // 3. Игрок досмотрел рекламу! 
            game.unlockedHints.push(currentStep); // Запоминаем, что для этого шага реклама просмотрена
            
            // Возвращаем кнопке нормальный вид
            videoHintBtn.textContent = '💡 Посмотреть подсказку';
            videoHintBtn.disabled = false;
            
            // И сразу показываем контент
            showHintContent(currentStep);
        });
    });
}

// Функция для сброса/обновления вида кнопки при смене шага
function updateHintButtonState(hintBtn, step) {
    if (game.unlockedHints.includes(step)) {
        hintBtn.innerHTML = t('videoHintStudy_unlocked') || '💡 Посмотреть подсказку';
        hintBtn.disabled = false;
    } else {
        hintBtn.innerHTML = t('videoHintStudy_locked') || '🎬 Смотреть рекламу за подсказку';
        hintBtn.disabled = false;
    }
}

async function backNextTransfer(next = false, countStep, backBtn, step, nextBtn, videoHintBtn) {
    const currentStep = game.trainingStep;
    const elements = { countStep, backBtn, step, nextBtn };
    const progressbar = document.getElementById('progressFillStudy');

    if (next) {
        progressbar.style.width = `${progressBarCon + procFromStep}%` ;
        cLog(`${progressBarCon + procFromStep}%`)
        progressBarCon += procFromStep;
        const targetStep = Math.min(TOTAL_STEPS, currentStep + 1);
        setTrainingStep(targetStep, elements);

        if (targetStep >= 2) updateHintButtonState(videoHintBtn, targetStep);

        // ⚙️ Специфичная логика ТОЛЬКО для перехода с шага 0 на 1
        if (currentStep === 0) {
            // step.innerText = ''; 
            if (!cube.startScrambleStudy) {
                game.active = true;
                await scrambleCube(20);
            }
            isScramblingPhase = false;
            cube.startScrambleStudy = true;
        }
    } else {
        progressbar.style.width = `${progressBarCon - procFromStep}%` ;
        cLog(`${progressBarCon - procFromStep}%`)
        progressBarCon -= procFromStep;
        const targetStep = Math.max(0, currentStep - 1); // Не даем уйти ниже 0
        setTrainingStep(targetStep, elements);

        if (targetStep >= 2) updateHintButtonState(videoHintBtn, targetStep);

        // ⚙️ Специфичная логика при возврате на шаг 0
        if (targetStep === 0) {
            cube.startScrambleStudy = false; // Оставляем твою логику
            isScramblingPhase = true;
        }
    }
}

function setTrainingStep(targetStep, elements) {
    const videoHintBtn = document.getElementById('videoHintStudy');
    const { countStep, backBtn, step, nextBtn } = elements;

    game.trainingStep = targetStep;
    countStep.innerHTML = `${targetStep}/8`; // Или твоя логика convertTextInLvl
    
    const currentKey = studyStepKeys[targetStep];
    step.innerHTML = `<div id="${currentKey}">${t(currentKey)}</div>`;

    backBtn.disabled = (targetStep === 0);
    
    if (targetStep < 2) {
        videoHintBtn.style.opacity = '0.5';
        videoHintBtn.disabled = true;
        videoHintBtn.innerHTML = t('videoHintStudy_locked') || '🔒 Недоступно';
    } else {
        videoHintBtn.style.opacity = '1';
        videoHintBtn.style.color = 'white';
        videoHintBtn.disabled = false;
        updateHintButtonState(videoHintBtn, targetStep);
    }

    if (targetStep === 0) {
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
    } else if (targetStep === 8) {
        nextBtn.style.opacity = '0.5';
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
    }
}