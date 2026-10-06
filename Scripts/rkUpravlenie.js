// rkUpravlenie.js т.е rk === рк т.е реклама (управление заработком)
import { textureManager } from "./texturing.js";
import { cLog, cWarn, isDev } from "./utils/logger.js";
import { showRewarded } from "./platform/ads.js";
import { getJSON, removeItem, setJSON, getPlayerCoins, spendPlayerCoins } from "./platform/storage.js";
import { analytics } from "./platform/analytics.js";
import { updateTextureSelectorOptions } from "./ui.js";
import { notif } from "./menu/data.js";
import { t } from "./translations.js";

export { spinWheelThemes }

const SPIN_COST = 70;

let spinWheelThemes = [
    { id: 'beautiful', name: 'Beautiful Fractal', config: { 'front': 'textures/customCube/beautiful_Fractal_greenSide512.jpg', 'back': 'textures/customCube/beautiful_OpticIllusion_blueSide512.jpg', 'right': 'textures/customCube/beautiful_GeometryWaltz_redSide512.jpg', 'left': 'textures/customCube/beautiful_Waves_orangeSide512.jpg', 'top': 'textures/customCube/beautiful_zigzagi_whiteSide512.jpg', 'bottom': 'textures/customCube/beautiful_cell_yellowSide512.jpg' }, rarity: 'rare', color: '#e74c3c' },
    { id: 'greatTree', name: 'Great Tree', config: { 'front': 'textures/customCube/greatTree_Iggdrasil_greenSide512.jpg', 'back': 'textures/customCube/greatTree_GrowingTree_blueSide512.jpg', 'right': 'textures/customCube/greatTree_Bloodforest_redSide512.jpg', 'left': 'textures/customCube/greatTree_SpaceTree_orangeSide512.jpg', 'top': 'textures/customCube/greatTree_WinterTree_whiteSide512.jpg', 'bottom': 'textures/customCube/greatTree_AutumnTree_yellowSide512.jpg' }, rarity: 'rare', color: '#2ecc71' },
    { id: 'cats', name: 'Cats', config: { 'front': 'textures/customCube/cats_forestCat_greenSide512c.jpg', 'back': 'textures/customCube/cats_waterCat_blueSide512c.jpg', 'right': 'textures/customCube/cats_fireCat_redSide512c.jpg', 'left': 'textures/customCube/cats_joyCat_orangeSide512c.jpg', 'top': 'textures/customCube/cats_snowCat_whiteSide512c.jpg', 'bottom': 'textures/customCube/cats_sunflowerCat_yellowSide512c.jpg' }, rarity: 'common', color: '#3498db' }, 
    { id: 'space', name: 'Space', config: { 'front': 'textures/customCube/space_nebuelaGreen_greenSide512.jpg', 'back': 'textures/customCube/space_planetEarth_blueSide512.jpg', 'right': 'textures/customCube/space_giantRed_redSide512.jpg', 'left': 'textures/customCube/space_planetJupiter_orangeSide512.jpg', 'top': 'textures/customCube/space_milkyway_whiteSide512.jpg', 'bottom': 'textures/customCube/space_nebuela_yellowSide512.jpg' }, rarity: 'rare', color: '#31ffaa' }
];

const rarityWeights = { common: 50, rare: 10, epic: 1 };

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const wheelContainer = document.getElementById('wheelContainer');
const closeBtnWF = document.querySelector('.close-btnWF');
const spinButton = document.getElementById('spinButton');

let isSpinning = false;
let segments = [];

function drawWheel() {
    if (!canvas || !ctx) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;
    const step = (2 * Math.PI) / segments.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    segments.forEach((segment, i) => {
        const angle = i * step - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + step);
        ctx.fillStyle = segment.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + step / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 20px Arial";
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 4;
        ctx.fillText(segment.label, radius - 25, 7);
        ctx.restore();
    });
}

export function updateWheelSegments() {
    segments = [];
    spinWheelThemes.forEach(theme => {
        segments.push({ label: theme.name, color: theme.color, themeId: theme.id });
    });

    if (segments.length < 3) {
        for (let i = 0; i < 3 - segments.length; i++) {
            segments.push({ label: t('wheelEmptySegment'), color: '#2c3e50', themeId: null });
        }
    }
    drawWheel();
}

function showWheelChoiceModal(currentBalance) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'wheel-choice-modal';
        modal.innerHTML = `
            <div class="wheel-choice-content">
                <span class="wheel-choice-close">&times;</span>
                <h2 style="margin-top:0">${t('wheelSpinTitle')}</h2>
                <p>${t('wheelYourBalance')} <b style="color:#f1c40f">${currentBalance} м</b></p>
                <p>${t('wheelSpinCost')} <b>${SPIN_COST} м</b></p>
                <button class="wheel-choice-btn btn-coins" id="payCoinsBtn">${t('wheelPayCoins', { cost: SPIN_COST })}</button>
                <button class="wheel-choice-btn btn-ads" id="payAdsBtn">${t('wheelWatchAd')}</button>
                <button class="wheel-choice-btn btn-cancel" id="cancelSpinBtn">${t('wheelCancel')}</button>
            </div>
        `;
        document.body.appendChild(modal);

        const close = (result) => { modal.remove(); resolve(result); };

        modal.querySelector('.wheel-choice-close').addEventListener('click', () => close(null));
        modal.querySelector('#cancelSpinBtn').addEventListener('click', () => close(null));
        modal.querySelector('#payCoinsBtn').addEventListener('click', () => close('coins'));
        modal.querySelector('#payAdsBtn').addEventListener('click', () => close('ads'));
        modal.addEventListener('click', (e) => { if (e.target === modal) close(null); });
    });
}

async function spinWheel() {
    cLog('🖱️ Клик по кнопке колеса! isSpinning:', isSpinning); // Диагностика
    
    if (isSpinning || segments.length === 0) return;

    const totalWeight = segments.reduce((sum, seg) => {
        const theme = spinWheelThemes.find(t => t.id === seg.themeId);
        return sum + (theme ? (rarityWeights[theme.rarity] || 1) : 1);
    }, 0);
    
    let random = Math.random() * totalWeight;
    let chosenSegment = segments[segments.length - 1];
    
    for (const seg of segments) {
        const theme = spinWheelThemes.find(t => t.id === seg.themeId);
        const weight = theme ? (rarityWeights[theme.rarity] || 1) : 1;
        if (random < weight) { chosenSegment = seg; break; }
        random -= weight;
    }

    const segIndex = segments.indexOf(chosenSegment);
    const step = 360 / segments.length;
    const targetAngle = 360 * 5 - (segIndex * step + step / 2); 

    const balance = getPlayerCoins();
    const choice = await showWheelChoiceModal(balance);

    if (!choice) {
        cLog('Вращение отменено пользователем');
        return; 
    }

    if (choice === 'coins') {
        if (!spendPlayerCoins(SPIN_COST)) {
            notif.error(t('wheelNotEnoughCoins'), 'center', 3000);
            return;
        }
    } else {
        const adWatched = await showRewarded();
        if (!adWatched) return; 
    }

    isSpinning = true;
    if (spinButton) spinButton.disabled = true;
    if (!isDev) analytics.wheelSpinned();

    canvas.style.transform = `rotate(${targetAngle}deg)`;

    setTimeout(() => {
        isSpinning = false;
        grantTheme(chosenSegment);
    }, 4000);
}

function grantTheme(segment) {
    if (!segment.themeId) {
        cLog('Выпало "Пусто"');
        resetWheel();
        return;
    }

    const theme = spinWheelThemes.find(t => t.id === segment.themeId);
    const success = textureManager.addCustomTheme(theme.id, theme.config, theme.name);

    if (success) {
        if (!isDev) analytics.themeUnlocked(theme.id);
        updateTextureSelectorOptions();

        notif.success(`${t('wheelGotTheme')} "${theme.name}"`, 'center', 4000);
         
        setTimeout(() => {
            const idx = spinWheelThemes.findIndex(t => t.id === theme.id);
            if (idx !== -1) {
                spinWheelThemes.splice(idx, 1);
                setJSON('spinWheelThemes', spinWheelThemes);
                updateWheelSegments();
            }
            resetWheel();
        }, 2000);
    } else {
        resetWheel();
    }
}

function resetWheel() {
    if (!canvas) return;
    canvas.style.transition = 'none';
    canvas.style.transform = 'rotate(0deg)';
    if (spinButton) spinButton.disabled = false;
    void canvas.offsetWidth; 
    setTimeout(() => {
        canvas.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.21, 0.99)';
    }, 50);
}

export function loadSpinWheelFromStorage() {
    try {
        const loadedThemes = getJSON('spinWheelThemes');
        if (Array.isArray(loadedThemes) && loadedThemes.length > 0) {
            spinWheelThemes.length = 0;
            spinWheelThemes.push(...loadedThemes);
            cLog(`Загружено ${loadedThemes.length} тем из storage`);
        }
    } catch (error) {
        console.error('Ошибка при загрузке барабана спина:', error);
        removeItem('spinWheelThemes');
    }
}

export function showWheel() {
    if (!wheelContainer) return;
    updateWheelSegments();
    wheelContainer.style.display = 'flex';
    setTimeout(() => wheelContainer.classList.add('visible'), 10);
}

export function hideWheel() {
    if (!wheelContainer) return;
    wheelContainer.classList.remove('visible');
    setTimeout(() => { wheelContainer.style.display = 'none'; }, 300);
}

// --- СБРОС КОЛЕСА К НАЧАЛЬНОМУ СОСТОЯНИЮ ---
export function resetWheelToDefault() {
    // 1. Очищаем текущий массив тем
    spinWheelThemes.length = 0;
    
    // 2. Восстанавливаем 4 стандартные темы
    spinWheelThemes.push(
        { id: 'beautiful', name: 'Beautiful Fractal', config: { 'front': 'textures/customCube/beautiful_Fractal_greenSide512.jpg', 'back': 'textures/customCube/beautiful_OpticIllusion_blueSide512.jpg', 'right': 'textures/customCube/beautiful_GeometryWaltz_redSide512.jpg', 'left': 'textures/customCube/beautiful_Waves_orangeSide512.jpg', 'top': 'textures/customCube/beautiful_zigzagi_whiteSide512.jpg', 'bottom': 'textures/customCube/beautiful_cell_yellowSide512.jpg' }, rarity: 'rare', color: '#e74c3c' },
        { id: 'greatTree', name: 'Great Tree', config: { 'front': 'textures/customCube/greatTree_Iggdrasil_greenSide512.jpg', 'back': 'textures/customCube/greatTree_GrowingTree_blueSide512.jpg', 'right': 'textures/customCube/greatTree_Bloodforest_redSide512.jpg', 'left': 'textures/customCube/greatTree_SpaceTree_orangeSide512.jpg', 'top': 'textures/customCube/greatTree_WinterTree_whiteSide512.jpg', 'bottom': 'textures/customCube/greatTree_AutumnTree_yellowSide512.jpg' }, rarity: 'rare', color: '#2ecc71' },
        { id: 'cats', name: 'Cats', config: { 'front': 'textures/customCube/cats_forestCat_greenSide512c.jpg', 'back': 'textures/customCube/cats_waterCat_blueSide512c.jpg', 'right': 'textures/customCube/cats_fireCat_redSide512c.jpg', 'left': 'textures/customCube/cats_joyCat_orangeSide512c.jpg', 'top': 'textures/customCube/cats_snowCat_whiteSide512c.jpg', 'bottom': 'textures/customCube/cats_sunflowerCat_yellowSide512c.jpg' }, rarity: 'common', color: '#3498db' },
        { id: 'space', name: 'Space', config: { 'front': 'textures/customCube/space_nebuelaGreen_greenSide512.jpg', 'back': 'textures/customCube/space_planetEarth_blueSide512.jpg', 'right': 'textures/customCube/space_giantRed_redSide512.jpg', 'left': 'textures/customCube/space_planetJupiter_orangeSide512.jpg', 'top': 'textures/customCube/space_milkyway_whiteSide512.jpg', 'bottom': 'textures/customCube/space_nebuela_yellowSide512.jpg' }, rarity: 'rare', color: '#31ffaa' }
    );
    
    // 3. Удаляем из localStorage, чтобы при перезагрузке было чисто
    removeItem('spinWheelThemes');
    
    // 4. Перерисовываем Canvas и обновляем UI
    updateWheelSegments();
    cLog('🔄 Колесо фортуны сброшено к 4 стандартным темам');
}

export function initWheelOfFortune() {
    if (!spinButton) { cWarn('Кнопка вращения не найдена'); return; }
    
    // Защита от двойного навешивания событий
    const newBtn = spinButton.cloneNode(true);
    spinButton.parentNode.replaceChild(newBtn, spinButton);
    
    newBtn.addEventListener('click', spinWheel);
    if (closeBtnWF) closeBtnWF.addEventListener('click', hideWheel);
    
    wheelContainer.addEventListener('click', (e) => { if (e.target === wheelContainer) hideWheel(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && wheelContainer.style.display === 'flex') hideWheel(); });

    loadSpinWheelFromStorage();
    updateTextureSelectorOptions();
    updateWheelSegments();
    cLog('✅ Колесо Фортуны инициализировано (Canvas)');
}