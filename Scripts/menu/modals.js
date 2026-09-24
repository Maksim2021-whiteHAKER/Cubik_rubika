// Scripts/menu/modals.js
import { updateSettingTitle } from './help.js';
import { showWheel } from '../rkUpravlenie.js';

let blurMenu, pauseMenu;

export function ensureModalContainers() {
    if (blurMenu) return;

    blurMenu = document.createElement('div');
    blurMenu.id = 'blurmenu';
    blurMenu.style.display = 'none';

    pauseMenu = document.createElement('div');
    pauseMenu.id = 'pause-menu';
    pauseMenu.style.display = 'none';
    pauseMenu.innerHTML = `
        <h2 id="pause">Пауза</h2>
        <button id="resumeBtn" class="resume">Вернуться</button>
        <button id="resetAndExitBtn" class="resetAndExit">Сбросить и выйти</button>
        `;

    document.body.appendChild(blurMenu);
    document.body.appendChild(pauseMenu);
}

export function getPauseMenu() { return pauseMenu}
export function getBlurMenu() { return blurMenu}

// Функции управления модалками
export function showModal(modal){
    if (modal){
        // Скрываем все модалки перед показом новой
        document.querySelectorAll(['.modal', '.modal_set']).forEach(m => m.style.display = 'none');
        modal.style.display = 'block';       
    }
}

export function hideModals() {
    document.querySelectorAll(['.modal','.modal_set','.wheel-container']).forEach(m => m.style.display = 'none');
}

export function hideModalWF(){
    document.querySelectorAll('.wheel-container').forEach(wc => wc.style.display = 'none');
}

export function initModalClose() {
    // Закрытие модалок
    document.querySelectorAll('.close-btn, .close-btnWF').forEach(btn => {
        if (btn.classList.contains('close-btn')) {
            btn.addEventListener('click', hideModals);
        } else if (btn.classList.contains('close-btnWF')) {
            btn.addEventListener('click', hideModalWF);
        }
    });

    window.addEventListener('click', (e) => {
        if ((e.target.classList.contains('modal') || e.target.classList.contains('modal_set')) &&
            !e.target.closest('#pause-menu')) {
            hideModals();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hideModals();
    });
}

export function initMainMenuButtons() {
    const helpModal = document.getElementById('helpModal');
    const settingsModal = document.getElementById('settingsModal');
    const creatorModal = document.getElementById('creatorModal')
    const supportModal = document.getElementById('supportModal')

    document.getElementById('viewWheelFortune')?.addEventListener('click', showWheel);
    document.getElementById('helpBtn')?.addEventListener('click', () => showModal(helpModal));
    document.getElementById('creatorBtn')?.addEventListener('click', () => showModal(creatorModal));
    document.getElementById('supportBtn')?.addEventListener('click', () => showModal(supportModal));
    document.getElementById('settingsBtn')?.addEventListener('click', () => {
        showModal(settingsModal);
        updateSettingTitle()
    })
}