// Scripts/cube/colors.js
import { cube } from "../state.js";
import { cWarn, cLog } from "../utils/logger.js";

const colorThemes = {
    'classic':{
        'red': 0xff0000,
        'green': 0x00ff00,
        'blue': 0x0000ff,
        'white': 0xffffff,
        'yellow': 0xffff00,
        'orange':0xffa500,
        'black': 0x111111
    },

    'neon': {
        'red':    0xFF0080,  // розово-малиновый (magenta-red), не «кирпич»
        'green':  0x39FF14,  // классический neon green («кислотный лайм»)
        'blue':   0x00BFFF,  // deep sky blue — голубой, не «тёмно-синий»
        'white':  0xF0FFFF,  // «айсберг» — белый с лёгким голубым
        'yellow': 0xEEFF00,  // жёлто-лаймовый (chartreuse), не «школьный жёлтый»
        'orange': 0xFF5F1F,  // «огненный» — между красным и оранжевым
        'black':  0x0A0A1A   // почти чёрный с синим подтоном
    },
    
    'monochrome':{
        'black': 0x080808,
        'red': 0x2E2E2E,
        'orange': 0x505050,
        'green': 0x787878,
        'blue': 0xA0A0A0,
        'yellow': 0xC8C8C8,
        'white': 0xF0F0F0
    },
}

const NO_COLOR_OVERLAY_THEME = {
    'black': 0x002127,  // темно синий
    'red': 0xffffff,
    'orange': 0xffffff,
    'green': 0xffffff,
    'blue': 0xffffff,
    'yellow': 0xffffff,
    'white': 0xffffff
}

export function applyColorTheme(themeName) {
    let theme;    
    if (themeName === 'non_cassat'){
        theme = NO_COLOR_OVERLAY_THEME;
    } else {
        theme = colorThemes[themeName];
        if (!theme) {
            cWarn(`Тема "${themeName}" не найдена.`);
            return;
        }
    }

    cLog(`Применение цветовой темы: ${themeName}`);

    const objects = cube.objects; // Получаем массив динамических объектов (_objects)

    objects.forEach(group => { // Проходим по каждой группе (мини-кубику)
        group.traverse(mesh => { // Проходим по каждому мешу внутри группы
             if (mesh.isMesh) {
                 // 2. Идентификация цвета
                 // Предполагаем, что имя материала в .glb соответствует цвету.
                 // Это самый надежный способ, если вы экспортировали модель с такими именами.
                 const materialName = mesh.material.name ? mesh.material.name.toLowerCase() : '';
                 let colorKey = null;

                 // Сопоставляем имя материала с ключом темы
                 // Вам нужно проверить cLog из initCube, чтобы точно знать имена материалов
                 if (materialName.includes('red') || materialName.includes('красн')) {
                     colorKey = 'red';
                 } else if (materialName.includes('green') || materialName.includes('зелен') || materialName.includes('GREEN.003')) {
                     colorKey = 'green';
                 } else if (materialName.includes('blue') || materialName.includes('син') || materialName.includes('BLUE.006')) {
                     colorKey = 'blue';
                 } else if (materialName.includes('white') || materialName.includes('бел') || materialName.includes('WHITE.005')) {
                     colorKey = 'white';
                 } else if (materialName.includes('yellow') || materialName.includes('желт') || materialName.includes('YELLOW.002')) {
                     colorKey = 'yellow';
                 } else if (materialName.includes('orange') || materialName.includes('оранж') || materialName.includes('ORANGE.007')) {
                     colorKey = 'orange';
                 } else if (materialName.includes('black') || materialName.includes('черн') || materialName.includes('BLACK.004')) {
                     colorKey = 'black';
                 } else {
                     // Если имя материала не распознано, можно пропустить или вывести предупреждение
                     cWarn(`Не удалось определить цвет для материала: ${materialName} у меша ${mesh.name}`);
                     return; // Пропускаем этот меш
                 }

                 // 3. Применение цвета
                 if (colorKey && theme[colorKey] !== undefined) {
                     // Получаем новый цвет из темы
                     const newColorHex = theme[colorKey];

                     // Меняем цвет у оригинального материала меша (видимый цвет)
                     mesh.material.color.set(newColorHex);
                     mesh.material.needsUpdate = true; // Сообщаем Three.js об изменении

                     // Меняем цвет в сохраненном оригинальном материале
                     // Это важно, если вы используете originalMaterials для сброса эффектов или
                     // если они используются где-то еще. Также обеспечивает корректную работу
                     // при последующих переключениях тем.
                     const originalMat = cube.originalMaterials.get(mesh.uuid);
                     if (originalMat) {
                         originalMat.color.set(newColorHex);
                         originalMat.needsUpdate = true;
                     }
                     // cLog(`Меняем цвет меша ${mesh.name} (${materialName}) на ${colorKey}: #${newColorHex.toString(16).padStart(6, '0')}`);
                 }
             }
        });
    });
    cLog(`Цветовая тема "${themeName}" применена.`);
}