// Scripts/customSettingImage.js
import { notif } from './menu/data.js'; // Или твой путь к уведомлениям
import { compressImage } from './utils/compress.js';
import { cLog } from './utils/logger.js';
import { setJSON, spendPlayerCoins } from './platform/storage.js';
import { applyTextures } from './texturing.js';
// Переменная для временного хранения выбранных файлов до нажатия "Применить"
let tempCustomTextures = {};
let currentActiveSide = null;

const customModal = document.getElementById('customTextureModal');
const fileInputModal = document.getElementById('customFileInputModal');
const applyBtn = document.getElementById('applyCustomTexturesBtn');
const cancelBtn = document.getElementById('cancelCustomTexturesBtn');
const closeBtn = document.getElementById('closeCustomModal');

// Функция открытия модалки (вызывай её при клике на кнопку "Загрузить" в настройках)
export function openCustomTextureModal() {
    tempCustomTextures = {}; // Очищаем временное хранилище
    currentActiveSide = null;
    
    // Сбрасываем все превью к "+"
    document.querySelectorAll('.face-preview').forEach(el => {
        el.style.backgroundImage = 'none';
        el.classList.remove('has-image');
        el.textContent = '+';
    });
    
    customModal.style.display = 'block';
}

// Обработка клика по грани
document.querySelectorAll('.face-slot').forEach(slot => {
    slot.addEventListener('click', () => {
        currentActiveSide = slot.dataset.side;
        fileInputModal.click(); // Открываем системный выбор файла
    });
});

// Когда файл выбран
fileInputModal.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file || !currentActiveSide) return;

    // Валидация
    if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение (JPG, PNG)');
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        alert('Файл слишком большой! Максимум 5 МБ.');
        return;
    }

    notif.info('⏳ Сжатие изображения...', 'center', 2000);

    try {
        // Сжимаем изображение (используем ту же логику, что и раньше)
        const compressedBase64 = await compressImage(file);
        
        // Сохраняем во временное хранилище
        tempCustomTextures[currentActiveSide] = compressedBase64;
        
        // Показываем превью в модалке
        const previewEl = document.getElementById(`preview-${currentActiveSide}`);
        previewEl.style.backgroundImage = `url(${compressedBase64})`;
        previewEl.classList.add('has-image');
        previewEl.textContent = '';
        
        cLog(`✅ Грань ${currentActiveSide} обновлена в предпросмотре`);
    } catch (err) {
        notif.error(`Ошибка: ${err}`, 'center', 4000);
    }
    
    // Сбрасываем инпут, чтобы можно было выбрать тот же файл снова
    fileInputModal.value = '';
});

// Кнопка "Применить"
if (applyBtn) {
    applyBtn.addEventListener('click', async () => {
        const sidesCount = Object.keys(tempCustomTextures).length;
        
        if (sidesCount === 0) {
            notif.warn('Вы не выбрали ни одного изображения!', 'center', 3000);
            return;
        }

        // 1. СПИСЫВАЕМ 50 МОНЕТ ТОЛЬКО ЗДЕСЬ
        const replacePrice = 50;
        // (Предполагается, что spendPlayerCoins импортирована)
        if (!spendPlayerCoins(replacePrice)) {
            notif.error(`Недостаточно монет! Нужно ${replacePrice}`, 'center', 4000);
            return;
        }

        try {
            // 2. Формируем итоговый объект (незаполненные грани берем из первой выбранной или оставляем пустыми, но лучше заполнить)
            const finalTextureData = {
                front: tempCustomTextures.front || tempCustomTextures[Object.keys(tempCustomTextures)[0]],
                back: tempCustomTextures.back || tempCustomTextures[Object.keys(tempCustomTextures)[0]],
                right: tempCustomTextures.right || tempCustomTextures[Object.keys(tempCustomTextures)[0]],
                left: tempCustomTextures.left || tempCustomTextures[Object.keys(tempCustomTextures)[0]],
                top: tempCustomTextures.top || tempCustomTextures[Object.keys(tempCustomTextures)[0]],
                bottom: tempCustomTextures.bottom || tempCustomTextures[Object.keys(tempCustomTextures)[0]]
            };

            // 3. Сохраняем в localStorage
            setJSON('user_custom_texture_data', finalTextureData);
            
            notif.success(`✅ Текстуры применены! Списано ${replacePrice} монет.`, 'center', 4000);
            customModal.style.display = 'none';
            
            // 4. Обновляем кубик
            await applyTextures('custom_user'); 
            
        } catch (err) {
            notif.error('Ошибка сохранения: переполнена память браузера.', 'center', 4000);
        }
    });
}

// Закрытие модалки
cancelBtn.addEventListener('click', () => customModal.style.display = 'none');
closeBtn.addEventListener('click', () => customModal.style.display = 'none');