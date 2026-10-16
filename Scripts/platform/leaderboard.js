// Scripts/platform/leaderboard.js
import { cLog, cWarn } from '../utils/logger.js';
import { t } from '../translations.js';

const LEADERBOARD_NAME = 'bestTimeNormal';

/**
 * Отправить результат в таблицу лидеров
 * @param {number} timeInSeconds - Время сборки в секундах (целое число!)
 */
export async function sendScoreToLeaderboard(timeInSeconds) {
    if (typeof window.ysdk === 'undefined' || !window.ysdk.getLeaderboards) {
        cWarn('Yandex SDK или лидерборды недоступны (локальный тест)');
        return;
    }

    try {
        // Яндекс принимает ТОЛЬКО целые числа. Округляем или берем Math.floor
        const score = Math.floor(timeInSeconds); 
        
        const leaderboards = await window.ysdk.getLeaderboards();
        await leaderboards.setLeaderboardScore(LEADERBOARD_NAME, score);
        cLog(`✅ Результат ${score} сек. отправлен в лидерборд!`);
    } catch (error) {
        cWarn('❌ Ошибка отправки результата в лидерборд:', error);
    }
}

/**
 * Получить и отобразить данные из таблицы лидеров
 */
export async function showLeaderboard() {
    const modal = document.getElementById('leaderboardModal');
    const listContainer = document.getElementById('leaderboardList');
    
    if (!modal || !listContainer) return;

    modal.style.display = 'flex';
    listContainer.innerHTML = `<p style="text-align: center;">${t('lb_loading') || 'Загрузка...'}</p>`;

    if (typeof window.ysdk === 'undefined' || !window.ysdk.getLeaderboards) {
        listContainer.innerHTML = `<p style="text-align: center; color: #ff5555;">${t('lb_unavailable') || 'Недоступно в локальном режиме'}</p>`;
        return;
    }

    try {
        const leaderboards = await window.ysdk.getLeaderboards();
        
        // Запрашиваем: 5 лучших, 3 вокруг игрока, и обязательно включить данные игрока
        const entries = await leaderboards.getLeaderboardEntries(LEADERBOARD_NAME, {
            quantityTop: 5,
            quantityCenter: 3,
            includeUser: true
        });

        listContainer.innerHTML = ''; // Очистка

        if (!entries || entries.entries.length === 0) {
            listContainer.innerHTML = `<p style="text-align: center;">${t('lb_no_data') || 'Пока нет записей. Будь первым!'}</p>`;
            return;
        }

        // Рендерим список
        entries.entries.forEach((entry, index) => {
            const isUser = entry.rank === entries.userRank; // Подсветка игрока
            
            const div = document.createElement('div');
            div.className = `lb-entry ${isUser ? 'is-user' : ''}`;
            
            // Форматируем время из секунд обратно в ММ:СС для красоты
            const mins = Math.floor(entry.score / 60);
            const secs = entry.score % 60;
            const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

            div.innerHTML = `
                <span class="lb-rank">#${entry.rank}</span>
                <span class="lb-name">${entry.player.publicName || t('lb_anonymous') || 'Аноним'}</span>
                <span class="lb-score">${timeStr}</span>
            `;
            listContainer.appendChild(div);
        });

    } catch (error) {
        cWarn('❌ Ошибка получения данных лидерборда:', error);
        listContainer.innerHTML = `<p style="text-align: center; color: #ff5555;">Ошибка загрузки / Error loading</p>`;
    }
}