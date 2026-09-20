// Scripts/ui.js
import { ui, game } from "./state";
import { stopTimer } from "./timer";
import { cLog } from "./utils/logger";

// функция для обновления прогресса
export function updateProgressBar(percentage){
    const progressFill = document.getElementById('progressFill');
    const progress_text = document.getElementById('progtext')
    cLog(`${percentage}%`)
    if (progressFill){
        progressFill.style.width = `${percentage}%`;       
        progress_text.style.color = '#ffff00'
        progress_text.textContent = `${Math.round(percentage)}%`       
    
        // Показываем модальное окно при достижении 100%
        if (percentage >= 100) {
            // Небольшая задержка для завершения анимации
            setTimeout(() => {
                if (ui.congratsModal && game.mode === 'normal') {
                    ui.congratsModal.style.display = 'block';
                    game.active = false;
                    stopTimer();
                }
            }, 300);
        }
    } else {
        console.error('Элементы прогресс-бара не найдены!');
    }
}