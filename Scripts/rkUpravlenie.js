// rkUpravlenie.js т.е rk === рк т.е реклама (управление заработком)
import { textureManager } from "./texturing.js";
import { updateFormStyle } from "./menu/form.js"
import { cLog, cWarn } from "./utils/logger.js";
export {spinWheelThemes}

// 22.01.2025 Определяем все возможные темы для "спина"
const spinWheelThemes = [
    {
        id: 'beautiful',
        name: 'Beautiful Fractal',
        config: {
            'front': 'textures/customCube/beautiful_Fractal_greenSide512.jpg',
            'back': 'textures/customCube/beautiful_OpticIllusion_blueSide512.jpg',
            'right': 'textures/customCube/beautiful_GeometryWaltz_redSide512.jpg',
            'left': 'textures/customCube/beautiful_Waves_orangeSide512.jpg',
            'top': 'textures/customCube/beautiful_zigzagi_whiteSide512.jpg',
            'bottom': 'textures/customCube/beautiful_cell_yellowSide512.jpg',
        },
        rarity: 'rare',
        color: '#e74c3c'
    },
    {
        id: 'greatTree',
        name: 'Great Tree',
        config: {
            'front': 'textures/customCube/greatTree_Iggdrasil_greenSide512.jpg',
            'back': 'textures/customCube/greatTree_GrowingTree_blueSide512.jpg',
            'right': 'textures/customCube/greatTree_Bloodforest_redSide512.jpg',
            'left': 'textures/customCube/greatTree_SpaceTree_orangeSide512.jpg',
            'top': 'textures/customCube/greatTree_WinterTree_whiteSide512.jpg',
            'bottom': 'textures/customCube/greatTree_AutumnTree_yellowSide512.jpg',
        },
        rarity: 'rare',
        color: '#2ecc71'
    },
    {
        id: 'mems',
        name: 'Memes',
        config: {
            'front': 'textures/customCube/mems_FrogPepe_greenSide512.jpg',
            'back': 'textures/customCube/mems_SadCat_blueSide512.jpg',
            'right': 'textures/customCube/mems_blyaa_redSide512.jpg',
            'left': 'textures/customCube/mems_Doge_orangeSide512.jpg',
            'top': 'textures/customCube/mems_Trololo_whiteSide512.jpg',
            'bottom': 'textures/customCube/mems_SurpriseCat_yellowSide512.jpg',
        },
        rarity: 'common',
        color: '#3498db'
    }, 
    {
        id: 'space',
        name: 'Space',
        config: {
            'front': 'textures/customCube/space_nebuelaGreen_greenSide512.jpg',
            'back': 'textures/customCube/space_planetEarth_blueSide512.jpg',
            'right': 'textures/customCube/space_giantRed_redSide512.jpg',
            'left': 'textures/customCube/space_planetJupiter_orangeSide512.jpg',
            'top': 'textures/customCube/space_milkyway_whiteSide512.jpg',
            'bottom': 'textures/customCube/space_nebuela_yellowSide512.jpg',
        },
        rarity: 'rare',
        color: '#31ffaa'
    }
];

const rarityWeights = {
    common: 50,
    rare: 10,
    epic: 1
};

// DOM элементы
const wheelContainer = document.getElementById('wheelContainer');
const wheel = document.getElementById('wheel');
const spinButton = document.getElementById('spinButton');
const closeBtnWF = document.querySelector('.close-btnWF');

// Инициализация
let isSpinning = false;
let segments = [];

// Загрузка тем из localStorage при старте
loadSpinWheelFromStorage();
updateTextureSelectorOptions();
updateWheelSegments();

// Выбор темы из барабана с учётом редкости
function pickRandomThemeFromWheel() {
    if (spinWheelThemes.length === 0) {
        cWarn('Нет доступных тем в колесе фортуны');
        return null;
    }

    // Создаем взвешенный список
    const weightedThemes = [];
    spinWheelThemes.forEach(theme => {
        const weight = rarityWeights[theme.rarity] || 1;
        for (let i = 0; i < weight; i++) {
            weightedThemes.push(theme);
        }
    });

    // Случайный выбор
    const randomIndex = Math.floor(Math.random() * weightedThemes.length);
    return weightedThemes[randomIndex];
}

// Удаление темы из барабана
function removeThemeFromWheel(themeId) {
    const index = spinWheelThemes.findIndex(theme => theme.id === themeId);
    if (index !== -1) {
        const removedTheme = spinWheelThemes.splice(index, 1)[0];
        localStorage.setItem('spinWheelThemes', JSON.stringify(spinWheelThemes));
        cLog(`Тема "${removedTheme.name}" удалена из колеса фортуны`);
        updateWheelSegments();
        return true;
    }
    return false;
}

// Загрузка спина из localStorage
export function loadSpinWheelFromStorage() {
    try {
        const saved = localStorage.getItem('spinWheelThemes');
        if (saved) {
            const loadedThemes = JSON.parse(saved);
            if (Array.isArray(loadedThemes) && loadedThemes.length > 0) {
                // Очищаем и добавляем загруженные темы
                spinWheelThemes.length = 0;
                spinWheelThemes.push(...loadedThemes);
                cLog(`Загружено ${loadedThemes.length} тем из localStorage`);
                // cLog(loadedThemes)
            }
        }
    } catch (error) {
        console.error('Ошибка при загрузке барабана спина:', error);
        // В случае ошибки используем дефолтные темы
        localStorage.removeItem('spinWheelThemes');
    }
}

// Обновление сегментов колеса
export function updateWheelSegments() {
    segments = [];
    
    // Создаем сегменты на основе доступных тем
    spinWheelThemes.forEach(theme => {
        segments.push({
            label: theme.name,
            color: theme.color,
            themeId: theme.id
        });
    });

    // Добавляем пустые сегменты для баланса, если мало тем
    if (segments.length < 3) {
        const emptySegments = 3 - segments.length;
        for (let i = 0; i < emptySegments; i++) {
            segments.push({
                label: 'Пусто',
                color: '#000001',
                themeId: null
            });
        }
    }

    // Создаем визуальное колесо
    createWheelSegments();
}

// Создание визуальных сегментов колеса
function createWheelSegments() {
    if (!wheel) {
        console.error('Элемент колеса не найден');
        return;
    }

    wheel.innerHTML = '';
    const segmentAngle = 360 / segments.length;

    segments.forEach((segment, index) => {
        const segDiv = document.createElement('div');
        segDiv.className = 'wheel-segment';
        segDiv.style.transform = `rotate(${index * segmentAngle}deg)`;
        segDiv.style.backgroundColor = segment.color;
        segDiv.dataset.themeId = segment.themeId || '';

        const content = document.createElement('div');
        content.className = 'wheel-segment-content';
        content.style.transform = `rotate(${segmentAngle / 2}deg)`;
        
        // Добавляем иконку для пустого сегмента
        if (!segment.themeId) {
            content.innerHTML = '🎁<br>Скоро';
        } else {
            content.innerHTML = `🎁<br>${segment.label}`;
        }

        segDiv.appendChild(content);
        wheel.appendChild(segDiv);
    });
}

// Основная функция разблокировки темы
export async function unlockCustomThemeViaSpin() {
    try {
        // Проверяем, есть ли доступные темы
        if (spinWheelThemes.length === 0) {
            showNotification('Колесо Фортуны пусто! Новые темы появятся в следующих обновлениях.', 'info');
            return null;
        }

        // Показываем рекламное видео
        let rewardGranted = false;
        
        if (typeof admob !== 'undefined' && admob.rewarded) {
            try {
                await admob.rewarded.show();
                
                // Ожидаем награду
                rewardGranted = await new Promise((resolve) => {
                    admob.rewarded.onRewarded = () => {
                        cLog('Видео успешно просмотрено');
                        resolve(true);
                    };
                    
                    admob.rewarded.onAdClosed = () => {
                        if (!rewardGranted) {
                            cLog('Реклама закрыта без награды');
                            resolve(false);
                        }
                    };
                    
                    admob.rewarded.onAdFailedToLoad = (error) => {
                        console.error('Ошибка загрузки рекламы:', error);
                        resolve(false);
                    };
                    
                    // Таймаут на случай, если событие не сработает
                    setTimeout(() => resolve(false), 30000);
                });
                
            } catch (error) {
                console.error('Ошибка при показе рекламы:', error);
                rewardGranted = false;
            }
        } else {
            // Для тестирования без AdMob
            // rewardGranted = true;
            alert('--- Колесо Фортуны не доступно ---\nразработчик решает проблему (рекламы пока нет)\n\n --- Wheel of Fortune not denied --- \n develover WIP (there are not ads yet)');
        }

        if (!rewardGranted) {
            showNotification('Реклама не была просмотрена полностью', 'error');
            return null;
        }

        // Выбираем и разблокируем тему
        const chosenTheme = pickRandomThemeFromWheel();
        if (!chosenTheme) {
            showNotification('Не удалось выбрать тему', 'error');
            return null;
        }

        // Добавляем тему через textureManager
        const success = textureManager.addCustomTheme(chosenTheme.id, chosenTheme.config, chosenTheme.name);
        
        if (success) {
            // Удаляем разблокированную тему из барабана
            removeThemeFromWheel(chosenTheme.id);
            
            // Обновляем UI
            updateTextureSelectorOptions();
            
            // Показываем уведомление об успехе
            showNotification(`🎉 Поздравляем! Вы получили тему: "${chosenTheme.name}"`, 'success');
            
            return chosenTheme;
        } else {
            showNotification('Не удалось добавить тему', 'error');
            return null;
        }

    } catch (error) {
        console.error('Ошибка в unlockCustomThemeViaSpin:', error);
        showNotification('Произошла ошибка при разблокировке темы', 'error');
        return null;
    }
}

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    // Удаляем старое уведомление, если есть
    const oldNotification = document.querySelector('.wheel-notification');
    if (oldNotification) {
        oldNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `wheel-notification wheel-notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 16px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Автоматическое скрытие
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
}

// Обновление селектора текстур
export function updateTextureSelectorOptions() {
    const selector = document.getElementById('theme-select');
    
    if (!selector) {
        cWarn('Элемент селектора текстур не найден для обновления.');
        return;
    }

    // Сохраняем текущее выбранное значение
    const currentValue = selector.value;

    // Очищаем список
    selector.innerHTML = '';

    // Добавляем бесплатные темы
    const freeThemes = [
        { value: 'default', text: 'По умолчанию / Default' },
        { value: 'cars', text: '🚗 Машины / Cars' },
        { value: 'gems', text: '💎 Драгоценности / Gems' },
        { value: 'girls', text: '🔥 Аниме / Anime' }
    ];

    freeThemes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme.value;
        option.textContent = theme.text;
        selector.appendChild(option);
    });

    // Добавляем разблокированные кастомные темы
    for (const themeId of Object.keys(textureManager.configTheme)) {
        if (themeId.startsWith('custom_')) {
            const themeData = textureManager.configTheme[themeId];
            const displayName = themeData._displayName || themeId.replace('custom_', '').replace(/_/g, ' ');
            const option = document.createElement('option');
            option.value = themeId;
            option.textContent = `⭐ ${displayName}`;
            option.dataset.custom = 'true';
            selector.appendChild(option);
        }
    }

    // Восстанавливаем выбранное значение
    if (selector.querySelector(`option[value="${currentValue}"]`)) {
        selector.value = currentValue;
    } else {
        selector.value = 'default';
    }

    const formStyle = document.getElementById('form_style');
    if (formStyle){
        const colorTheme = document.getElementById('color-theme-select').value;
        updateFormStyle(currentValue, colorTheme);
    }
}

// Показать колесо фортуны
export function showWheel() {
    if (!wheelContainer) {
        console.error('Контейнер колеса не найден');
        return;
    }

    // Обновляем сегменты перед показом
    updateWheelSegments();
    
    wheelContainer.style.display = 'flex';
    setTimeout(() => {
        wheelContainer.classList.add('visible');
    }, 10);
}

// Скрыть колесо фортуны
export function hideWheel() {
    if (!wheelContainer) return;
    
    wheelContainer.classList.remove('visible');
    setTimeout(() => {
        wheelContainer.style.display = 'none';
    }, 300); // Время на анимацию
}

// Вращение колеса
async function spinWheel() {
    if (isSpinning) {
        cLog('Колесо уже вращается');
        return;
    }

    if (spinWheelThemes.length === 0) {
        showNotification('Нет доступных тем для разблокировки', 'info');
        return;
    }

    isSpinning = true;
    spinButton.disabled = true;
    
    // Анимация вращения
    wheel.classList.add('spinning');
    
    try {
        // Ждем завершения анимации
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Разблокируем тему
        const unlockedTheme = await unlockCustomThemeViaSpin();
        
        if (unlockedTheme) {
            // Анимация успеха
            wheel.classList.add('success');
            setTimeout(() => wheel.classList.remove('success'), 1000);
        }
        
    } catch (error) {
        console.error('Ошибка при вращении колеса:', error);
        showNotification('Произошла ошибка', 'error');
    } finally {
        // Завершаем анимацию
        wheel.classList.remove('spinning');
        spinButton.disabled = false;
        isSpinning = false;
    }
}

// Инициализация событий
export function initWheelOfFortune() {
    if (!spinButton) {
        console.error('Кнопка вращения не найдена');
        return;
    }

    // Обработчик кнопки вращения
    spinButton.addEventListener('click', spinWheel);
    
    // Обработчик закрытия колеса
    if (closeBtnWF) {
        closeBtnWF.addEventListener('click', hideWheel);
    }
    
    // Закрытие по клику вне колеса
    wheelContainer.addEventListener('click', (e) => {
        if (e.target === wheelContainer) {
            hideWheel();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && wheelContainer.style.display === 'flex') {
            hideWheel();
        }
    });
    
    cLog('Колесо Фортуны инициализировано');
}

// Добавляем стили для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    .wheel-segment-content {
        transform-origin: center;
        text-align: center;
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        font-size: 12px;
        padding-top: 20px;
    }
    
    .wheel.spinning {
        animation: spin 4s cubic-bezier(0.1, 0.7, 0.1, 1);
    }
    
    .wheel.success {
        animation: pulse 1s;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(720deg); }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Автоматическая инициализация при загрузке
document.addEventListener('DOMContentLoaded', initWheelOfFortune);