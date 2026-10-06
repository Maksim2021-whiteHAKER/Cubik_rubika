import { getJSON, setJSON, spendPlayerCoins } from './storage.js';
import { cLog, cWarn } from '../utils/logger.js';
import { compressImage } from '../utils/compress.js';

// ✅ НОВОЕ: Один ключ для хранения всего объекта текстуры
const CUSTOM_TEXTURE_STORAGE_KEY = 'user_custom_texture_data';
const UNLOCK_CUSTOM_THEME = 'is_custom_texture_unlocked';
const SIDES = ['front', 'back', 'right', 'left', 'top', 'bottom'];

export function isCustomTextureUnlocked() {
    return localStorage.getItem(UNLOCK_CUSTOM_THEME) === 'true';
}

export function unlockCustomTexture() {
    const price = 1500;
    if (isCustomTextureUnlocked()) {
        cWarn('Пользовательская текстура уже разблокирована!');
        return { success: true, message: 'Уже разблокировано' };
    }

    if (spendPlayerCoins(price)) {
        localStorage.setItem(UNLOCK_CUSTOM_THEME, 'true');
        cLog(`✅ Пользовательская текстура разблокирована за ${price} монет`);
        return { success: true, message: 'Успешно разблокировано! Теперь замена стоит 50 монет.' };
    } else {
        return { success: false, message: `Недостаточно монет! Нужно ${price}` };
    }
}

export function processAndSaveCustomTheme(files) {
    return new Promise( async (resolve, reject) => {
        if (!isCustomTextureUnlocked()) {
            reject('Сначала разблокируйте эту функцию в настройках!');
            return;
        }

        const filesArray = Array.from(files);

        // Проверка количества файлов
        if (filesArray.length !== 1 && filesArray.length !== 6) {
            return reject('Пожалуйста, выберите ровно 1 изображение (для всех граней) или 6 изображений (по одному на грань).');
        }

        const replacePrice = 50;
        if (!spendPlayerCoins(replacePrice)) {
            reject(`Недостаточно монет для замены! Нужно ${replacePrice}`);
            return;
        }

        try {
            const compressImages = await Promise.all(filesArray.map(file => compressImage(file)));

            const textureData = {};

            if (filesArray.length === 1) {
                const singleImage = compressImages[0]
                SIDES.forEach(side => {
                    textureData[side] = singleImage;
                });
            } else {
                SIDES.forEach((side, index) => {
                    textureData[side] = compressImages[index];
                });
            }

            setJSON(CUSTOM_TEXTURE_STORAGE_KEY, textureData);
            cLog('✅ Пользовательская текстура успешно сохранена');
            resolve(textureData);
        } catch (err) {
            reject(`Ошибка обработки: ${err.message || err}`);
        }
    });    
}

export function getCustomTextureData() {
    return getJSON(CUSTOM_TEXTURE_STORAGE_KEY);
}