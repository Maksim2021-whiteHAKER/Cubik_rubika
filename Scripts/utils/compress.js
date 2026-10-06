// Scripts/utils/compress.js

// Вспомогательная функция для сжатия одного изображения
export function compressImage(file) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            return reject(`Файл "${file.name}" не является изображением`);
        }
        if (file.size > 5 * 1024 * 1024) {
            return reject(`Файл "${file.name}" слишком большой (макс. 5 МБ)`);
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 512;
                const ctx = canvas.getContext('2d');
                
                // Вписываем изображение в квадрат (cover)
                const scale = Math.max(512 / img.width, 512 / img.height);
                const x = (512 / 2) - (img.width / 2) * scale;
                const y = (512 / 2) - (img.height / 2) * scale;
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  
                resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
            img.onerror = () => reject(`Ошибка загрузки изображения "${file.name}"`);
            img.src = e.target.result;
        };
        reader.onerror = () => reject(`Ошибка чтения файла "${file.name}"`);
        reader.readAsDataURL(file);
    });
}