// Scripts/menu/modals.js
import { updateSettingTitle } from './help.js';
import { showWheel } from '../rkUpravlenie.js';
import { isYandex } from '../platform/detect.js';

let blurMenu, pauseMenu;

export function hideMenuContainers() {
    const mainM = document.getElementById('mainMenu');
    const gameModeSelectModal = document.getElementById('gameModeSelectModal');
    if (mainM && gameModeSelectModal) {
        mainM.style.display = 'none';
        gameModeSelectModal.style.display = 'none';
    }
}

export function ensureModalContainers() {
    if (blurMenu) return;

    blurMenu = document.createElement('div');
    blurMenu.id = 'blurmenu';
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

export function supportModalChanging() {
    const putStar = document.getElementById('putStar');
    const putStarYandex = document.getElementById('putStarYa');
    const financialHelpWallet = document.getElementById('financialHelpWallet');
    const financialHelpBoosty = document.getElementById('financialHelpBoosty');
    const financialHelpDonationAlerts = document.getElementById('financialHelpDonationAlerts');
    if (isYandex()) {
        putStarYandex.style.display = 'block';
        putStarYandex.innerHTML = window.t('putStarYa');
        putStar.style.display = 'none'
        financialHelpWallet.style.display = 'none'
        financialHelpBoosty.style.display = 'none';
        financialHelpDonationAlerts.style.display = 'none'
    } else {
        putStarYandex.style.display = 'none';
        putStar.style.display = 'block';
        putStar.innerHTML = `Поставить звезду на <a href="https://github.com/Maksim2021-whiteHAKER/Cubik_rubika" target="_blank" style="color: #00aaff;">GitHub</a> ⭐ `;
        financialHelpWallet.style.display = 'block'
        financialHelpBoosty.style.display = 'block'
        financialHelpDonationAlerts.style.display = 'block'
        financialHelpWallet.innerHTML = `Финансовая поддержка через кошелёк(wallet)<a href="https://yoomoney.ru/to/410015336126322" target="_blank" rel="noopener noreferrer" style="color: #00aaff;">YooMoney</a> 💰`;
        financialHelpBoosty.innerHTML = `Финансовая поддержка: <a href="https://boosty.to/ghostwarriorxz/donate" target="_blank" style="color: #00aaff;">Boosty</a> 💰`;
        financialHelpDonationAlerts.innerHTML = `Финансовая поддержка(иностранные пользователи) <a href="https://www.donationalerts.com/r/ghostwarriorxz" target="_blank" style="color: #FF0FA0;">donationalerts</a> 💰`;
    }
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
    document.querySelectorAll(['.modal','.modal_set','.wheel-container', '.modal_con']).forEach(m => m.style.display = 'none');
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
    const creatorModal = document.getElementById('creatorModal');
    const supportModal = document.getElementById('supportModal');
    const gameModeSelectModal = document.getElementById('gameModeSelectModal');

    document.getElementById('viewWheelFortune')?.addEventListener('click', showWheel);
    document.getElementById('playGameModeBtn')?.addEventListener('click', () => showModal(gameModeSelectModal));
    document.getElementById('helpBtn')?.addEventListener('click', () => showModal(helpModal));
    document.getElementById('creatorBtn')?.addEventListener('click', () => showModal(creatorModal));
    document.getElementById('supportBtn')?.addEventListener('click', () => showModal(supportModal));
    document.getElementById('settingsBtn')?.addEventListener('click', () => {
        showModal(settingsModal);
        updateSettingTitle();
    })
}

// Функция для подтверждения действия
export async function showConfirmationDialog(message) {
    return new Promise((resolve) => {
        const oldDialog = document.querySelector('.confirmation-dialog');
        if (oldDialog) oldDialog.remove();
        const oldOverlay = document.querySelector('.dialog-overlay');
        if (oldOverlay) oldOverlay.remove();

        const dialog = document.createElement('div');
        dialog.className = 'confirmation-dialog';
        dialog.innerHTML = `
            <h3>⚠️ Подтверждение</h3>
            <p>${message}</p>
            <div class="confirmation-buttons">
                <button class="confirm-btn confirm-yes">Да</button>
                <button class="confirm-btn confirm-no">Отмена</button>
            </div>
        `;
        document.body.appendChild(dialog);

        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        overlay.style.cssText = `
            position: fixed; inset: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
        `;
        document.body.appendChild(overlay);

        const cleanup = (result) => {
            dialog.remove();
            overlay.remove();
            document.removeEventListener('keydown', onEsc);
            resolve(result);
        };

        const onEsc = (e) => { if (e.key === 'Escape') cleanup(false); };

        dialog.querySelector('.confirm-yes').addEventListener('click', () => cleanup(true));
        dialog.querySelector('.confirm-no').addEventListener('click', () => cleanup(false));
        overlay.addEventListener('click', () => cleanup(false));
        document.addEventListener('keydown', onEsc);
    });
}